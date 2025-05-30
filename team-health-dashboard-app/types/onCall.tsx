export interface onCall{
    id: number,
    user_id: number,
    project_id: number,
    sprint_id: number,
    incidents_count: number,
    week_starting_date: Date
}
export interface incidents{
    id: number,
    user_id: number,
    project_id: number,
    sprint_id: number,
    incidents_count: number,
    week_starting_date: string,
    username: string
}