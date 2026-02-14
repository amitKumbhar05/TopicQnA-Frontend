import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

// --- TOPICS HOOKS ---

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data } = await api.get('/topics/');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name) => api.post('/topics/', { name }),
    onSuccess: () => {
      // Automatically refresh the list
      queryClient.invalidateQueries(['topics']);
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/topics/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['topics']);
    },
  });
}

// --- QUESTIONS HOOKS ---

export function useQuestions(topicId) {
  return useQuery({
    queryKey: ['questions', topicId],
    queryFn: async () => {
      const { data } = await api.get(`/topics/${topicId}/questions`);
      return data;
    },
    enabled: !!topicId, // Only fetch if topicId exists
  });
}

export function useCreateQuestion(topicId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(`/topics/${topicId}/questions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions', topicId]);
    },
  });
}

export function useDeleteQuestion(topicId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['questions', topicId]);
    },
  });
}

export function useReviseQuestion(topicId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.post(`/questions/${id}/revise`),
    onSuccess: () => {
      // Optimistic updates are complex, simple invalidation is safer for now
      queryClient.invalidateQueries(['questions', topicId]);
    },
  });
}