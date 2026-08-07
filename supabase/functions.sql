-- PostgreSQL RPC Functions for EduSurvey

CREATE OR REPLACE FUNCTION get_survey_analytics_rpc(survey_uuid UUID)
RETURNS TABLE (
    total_views INT,
    total_completions INT,
    avg_speed_sec INT,
    rate_percent NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.view_count,
        s.completion_count,
        s.avg_time_seconds,
        s.completion_rate
    FROM public.survey_statistics s
    WHERE s.survey_id = survey_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
