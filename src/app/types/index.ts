export type OnBoardingTaskTemplate = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    position: number;
    active: boolean;
    created_at: string;
    updated_at: string;
};

export type ApiOnBoardingTask = {
    id: string;
    candidate_id: string;
    onboarding_task_template_id: string;
    status: string;
    note: string | null;
    created_at: string;
    updated_at: string;
    onboarding_task_template: OnBoardingTaskTemplate;
};

export type FullApiCandidate = { 
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    contract_date: string;
    job_title: string;
    reporting_date: string;
    salary: string;
    company_id: string;
    other: Record<string, unknown>;
    contracts: unknown[];
    onboarding_tasks: ApiOnBoardingTask[];
}