declare global {
  interface CustomJwtSessionClaims {
    metadata: Record<string, never>;
  }
}

export {};
