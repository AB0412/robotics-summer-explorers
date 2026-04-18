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

interface RegistrationConfirmationProps {
  parentName?: string
  childName?: string
  registrationId?: string
  preferredBatch?: string
  programType?: string
}

const RegistrationConfirmationEmail = ({
  parentName,
  childName,
  registrationId,
  preferredBatch,
  programType,
}: RegistrationConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      Registration confirmed for {childName || 'your child'} at {SITE_NAME}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {parentName ? `Hi ${parentName},` : 'Hi there,'}
        </Heading>
        <Text style={text}>
          Thank you for registering{' '}
          <strong>{childName || 'your child'}</strong> with {SITE_NAME}! We
          have received your registration and are excited to welcome them to
          our program.
        </Text>

        <Section style={detailsBox}>
          <Heading as="h2" style={h2}>
            Registration Details
          </Heading>
          {registrationId && (
            <Text style={detailLine}>
              <strong>Registration ID:</strong> {registrationId}
            </Text>
          )}
          {programType && (
            <Text style={detailLine}>
              <strong>Program:</strong> {programType}
            </Text>
          )}
          {preferredBatch && (
            <Text style={detailLine}>
              <strong>Preferred Batch:</strong> {preferredBatch}
            </Text>
          )}
        </Section>

        <Text style={text}>
          Our team will be in touch shortly with next steps, schedule
          confirmation, and payment information. Please save your registration
          ID for future reference.
        </Text>

        <Text style={text}>
          If you have any questions, simply reply to this email and we'll get
          back to you as soon as possible.
        </Text>

        <Text style={footer}>
          Warm regards,
          <br />
          The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: RegistrationConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `Registration confirmed${data.childName ? ` for ${data.childName}` : ''} — ${SITE_NAME}`,
  displayName: 'Registration confirmation',
  previewData: {
    parentName: 'Jane Doe',
    childName: 'Alex Doe',
    registrationId: 'REG-1234567890-123',
    preferredBatch: 'Monday – 12:00 to 1:30 PM',
    programType: 'Summer Camp - 2026',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
}
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
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
const footer = {
  fontSize: '13px',
  color: '#888',
  margin: '24px 0 0',
}
