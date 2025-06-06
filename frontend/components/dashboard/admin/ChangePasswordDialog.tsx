"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  userName: string;
  onPasswordChanged: () => void; // Callback after successful change
}

export function ChangePasswordDialog({
  isOpen,
  onClose,
  userId,
  userName,
  onPasswordChanged,
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor, ingrese y confirme la nueva contraseña.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "La nueva contraseña y la confirmación no coinciden.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!userId) {
       toast({
        title: "Error",
        description: "ID de usuario no proporcionado.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Optional: Add more frontend password strength validation here

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/usuarios/${userId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Include authorization header if required
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cambiar la contraseña.");
      }

      toast({
        title: "Contraseña Actualizada",
        description: `La contraseña para ${userName} ha sido cambiada con éxito.`, // Usar userName
      });

      // Clear fields and close dialog
      setNewPassword("");
      setConfirmPassword("");
      onPasswordChanged(); // Callback to potentially refresh user list or state
      onClose();

    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña de {userName}</DialogTitle>
          <DialogDescription>
            Ingrese la nueva contraseña para {userName}. Esto no requiere la contraseña actual del usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              Nueva Contraseña
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-right">
              Confirmar Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 