export interface SubjectTopicDto {
  id: string;
  name: string;
}

export interface SubjectWithTopicsDto {
  id: string;
  name: string;
  topics: SubjectTopicDto[];
}
