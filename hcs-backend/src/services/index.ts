// Service exports for clean imports
export { authService } from "./auth.service";

// Re-export types for convenience
export type {
	LoginCredentials,
	RegisterData,
	AuthResult,
	JWTPayload,
	RefreshTokenPayload,
	AuthContext,
} from "./auth.service";
