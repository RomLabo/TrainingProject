import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  
    isAdmin!: number;

    isUser!: string;

    tooltip!: string;

  constructor() {}
  
}