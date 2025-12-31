/**
 * Shared types for technology detection
 */

export interface DetectionResult {
    /** Technology name (e.g., "React", "Vue", "Next.js") */
    name: string;
    /** Icon identifier for the technology */
    icon: string;
    /** Version string if detectable */
    version?: string;
    /** Whether the technology was detected */
    detected: boolean;
}

export type Detector = () => DetectionResult;
