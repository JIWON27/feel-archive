// 공통 타입 정의

export enum EmotionType {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANXIOUS = 'ANXIOUS',
  ANGRY = 'ANGRY',
  CALM = 'CALM',
  EXCITED = 'EXCITED',
  LONELY = 'LONELY',
  GRATEFUL = 'GRATEFUL',
  PEACEFUL = 'PEACEFUL',
  THRILLED = 'THRILLED',
  NOSTALGIC = 'NOSTALGIC',
}

export interface Location {
  latitude: number;
  longitude: number;
  locationName: string;
}
