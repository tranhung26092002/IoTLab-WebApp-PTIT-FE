import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/api/courseService';

export function useCourses() {
    const queryClient = useQueryClient();

    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await courseService.getAll();
            return response.data;
        },
    });

    const enrollCourse = useMutation({
        mutationFn: courseService.enroll,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });

    return {
        courses,
        isLoading,
        enrollCourse: enrollCourse.mutate,
    };
}