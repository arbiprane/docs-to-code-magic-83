import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  CollarType,
  JobImpact,
  RiskLevel,
} from "@/lib/jobs-data";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

function toJobImpact(row: Tables<"jobs">): JobImpact {
  return {
    id: row.id,
    jobTitle: row.job_title,
    jobCategory: row.job_category,
    collarType: row.collar_type as CollarType,
    mainTasks: row.main_tasks,
    aiExposureLevel: row.ai_exposure_level as RiskLevel,
    replacementRiskLevel: row.replacement_risk_level as RiskLevel,
    reason: row.reason,
    humanRelevantSkills: row.human_relevant_skills,
    aiToolsImpact: row.ai_tools_impact,
    validationNote: row.validation_note,
    recommendedAction: row.recommended_action,
    confidenceScore: row.confidence_score,
    validationStatus: row.validation_status as JobImpact["validationStatus"],
    sourceReference: row.source_reference,
    createdBy: row.created_by,
  };
}

export const jobsQueryKey = ["jobs"] as const;

export function useJobs() {
  return useQuery({
    queryKey: jobsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data.map(toJobImpact);
    },
  });
}

export type NewJobInput = {
  jobTitle: string;
  jobCategory: string;
  collarType: CollarType;
  mainTasks: string;
  aiExposureLevel: RiskLevel;
  replacementRiskLevel: RiskLevel;
};

export function useAddJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewJobInput) => {
      const { data: userData } = await supabase.auth.getUser();
      const payload: TablesInsert<"jobs"> = {
        job_title: input.jobTitle,
        job_category: input.jobCategory,
        collar_type: input.collarType,
        main_tasks: input.mainTasks,
        ai_exposure_level: input.aiExposureLevel,
        replacement_risk_level: input.replacementRiskLevel,
        created_by: userData.user?.id,
      };
      const { data, error } = await supabase
        .from("jobs")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return toJobImpact(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsQueryKey });
    },
  });
}
