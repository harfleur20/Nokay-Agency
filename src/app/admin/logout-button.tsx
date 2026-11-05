"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }
  return <button type="button" onClick={() => void logout()}>Déconnexion ↗</button>;
}
