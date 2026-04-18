/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'BotVenture Robotics'

interface AdminNotificationProps {
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  childName?: string
  childAge?: string
  childGrade?: string
  schoolName?: string
  registrationId?: string
  programType?: string
  preferredBatch?: string
  alternateBatch?: string
  registrationSummary?: string
}

const AdminNotificationEmail = (props: AdminNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      New registration: {props.childName || 'Unknown'} ({props.registrationId})
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Registration Received</Heading>
        <Text style={text}>
          A new registration has been submitted on {SITE_NAME}.
        </Text>

        <Section style={detailsBox}>
          <Heading as="h2" style={h2}>
            Quick Summary
          </Heading>
          {props.registrationId && (
            <Text style={detailLine}>
              <strong>ID:</strong> {props.registrationId}
            </Text>
          )}
          {props.childName && (
            <Text style={detailLine}>
              <strong>Child:</strong> {props.childName}
              {props.childAge ? `, age ${props.childAge}` : ''}
              {props.childGrade ? `, grade ${props.childGrade}` : ''}
            </Text>
          )}
          {props.schoolName && (
            <Text style={detailLine}>
              <strong>School:</strong> {props.schoolName}
            </Text>
          )}
          {props.parentName && (
            <Text style={detailLine}>
              <strong>Parent:</strong> {props.parentName}
            </Text>
          )}
          {props.parentEmail && (
            <Text style={detailLine}>
              <strong>Email:</strong> {props.parentEmail}
            </Text>
          )}
          {props.parentPhone && (
            <Text style={detailLine}>
              <strong>Phone:</strong> {props.parentPhone}
            </Text>
          )}
          {props.programType && (
            <Text style={detailLine}>
              <strong>Program:</strong> {props.programType}
            </Text>
          )}
          {props.preferredBatch && (
            <Text style={detailLine}>
              <strong>Preferred batch:</strong> {props.preferredBatch}
            </Text>
          )}
          {props.alternateBatch && (
            <Text style={detailLine}>
              <strong>Alternate batch:</strong> {props.alternateBatch}
            </Text>
          )}
        </Section>

        {props.registrationSummary && (
          <Section>
            <Heading as="h2" style={h2}>
              Full Details
            </Heading>
            <pre style={pre}>{props.registrationSummary}</pre>
          </Section>
        )}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New registration: ${data.childName || 'Unknown'} (${data.registrationId || 'no ID'})`,
  displayName: 'Registration admin notification',
  previewData: {
    parentName: 'Jane Doe',
    parentEmail: 'jane@example.com',
    parentPhone: '+1 555-1234',
    childName: 'Alex Doe',
    childAge: '10',
    childGrade: '5',
    schoolName: 'Lincoln Elementary',
    registrationId: 'REG-1234567890-123',
    programType: 'Summer Camp - 2026',
    preferredBatch: 'Monday – 12:00 to 1:30 PM',
    alternateBatch: 'Wednesday – 12:00 to 1:30 PM',
    registrationSummary: 'Sample registration summary text...',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
}
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#1a1a2e',
  margin: '0 0 16px',
}
const h2 = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a1a2e',
  margin: '0 0 12px',
}
const text = {
  fontSize: '14px',
  color: '#444',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const detailsBox = {
  backgroundColor: '#f5f7fa',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '20px 0',
}
const detailLine = {
  fontSize: '14px',
  color: '#444',
  margin: '4px 0',
}
const pre = {
  fontSize: '12px',
  color: '#333',
  backgroundColor: '#f5f7fa',
  padding: '12px',
  borderRadius: '6px',
  whiteSpace: 'pre-wrap' as const,
  fontFamily: 'monospace',
}
