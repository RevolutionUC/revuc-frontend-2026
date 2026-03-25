export interface ScheduleItem {
  id: string | number;
  name: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  capacity?: number | null;
  visibility?: "public" | "internal" | null;
}