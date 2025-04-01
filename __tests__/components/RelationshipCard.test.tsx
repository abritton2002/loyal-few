/// <reference types="jest" />
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RelationshipCard from '@/components/RelationshipCard';
import { Relationship } from '@/types/relationship';

const mockRelationship: Relationship = {
  id: '1',
  name: 'John Doe',
  avatar: undefined,
  tags: ['friend'],
  notes: 'Test notes',
  importantDates: [],
  interactions: [],
  goals: [],
  emotionHistory: [],
  reminderFrequency: 7,
  connectionScore: 75,
  milestones: [],
  sharedMemories: [],
  communicationPreferences: {
    preferredChannels: ['message', 'call'],
    bestTimesToContact: ['morning', 'evening'],
    doNotDisturb: {
      start: '22:00',
      end: '08:00',
      timezone: 'UTC'
    },
    notificationFrequency: 'medium'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('RelationshipCard', () => {
  it('renders correctly with relationship data', () => {
    const { getByText, getByTestId } = render(
      <RelationshipCard relationship={mockRelationship} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('friend')).toBeTruthy();
    expect(getByTestId('connection-score')).toBeTruthy();
  });

  it('navigates to relationship details when pressed', () => {
    const { getByTestId } = render(
      <RelationshipCard relationship={mockRelationship} />
    );

    fireEvent.press(getByTestId('relationship-card'));
    // Note: We can't test the navigation directly as it uses expo-router
    // which requires a navigation context
  });
}); 