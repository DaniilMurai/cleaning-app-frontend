/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Neuer Standard Admin API
 * OpenAPI spec version: 0.1.0
 */
import type { TaskUpdateTitle } from "./taskUpdateTitle";
import type { TaskUpdateDescription } from "./taskUpdateDescription";
import type { TaskUpdateFrequency } from "./taskUpdateFrequency";

export interface TaskUpdate {
	title?: TaskUpdateTitle;
	description?: TaskUpdateDescription;
	frequency?: TaskUpdateFrequency;
}
