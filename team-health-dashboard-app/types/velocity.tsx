export interface velocity{
    id: number,
    project_id: number,
    sprint_id: number,
    story_points_completed: number
}

export interface velocityCart{
    id: number,
    project_id: number,
    sprint_id: number,
    story_points_completed: number,
    endDate: string
}