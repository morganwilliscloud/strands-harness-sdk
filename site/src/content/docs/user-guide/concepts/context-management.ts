// @ts-nocheck
import { Agent, Offload } from '@strands-agents/sdk'
import { LocalFileStorage } from '@strands-agents/sdk/storage'

async function basic() {
  // --8<-- [start:basic]
  const agent = new Agent({
    contextManager: 'auto',
  })
  // --8<-- [end:basic]
}

async function agentic() {
  // --8<-- [start:agentic]
  const agent = new Agent({
    contextManager: 'agentic',
  })
  // --8<-- [end:agentic]
}

async function explicit() {
  // --8<-- [start:explicit]
  const agent = new Agent({
    contextManager: {
      strategies: [
        // Offload large tool results; keep a 500-token preview in context
        Offload.truncate('toolResults', { previewTokens: 500 }).when({ threshold: 2500 }),
        // Summarize older messages when the window reaches 85% utilization
        Offload.summarize('*').when({ utilization: 0.85, preserveRecent: 2 }),
      ],
      stash: {
        storage: new LocalFileStorage('./artifacts/'),
        retrievalTool: true,
      },
    },
  })
  // --8<-- [end:explicit]
}

async function presets() {
  // --8<-- [start:presets]
  const agent = new Agent({
    contextManager: {
      strategies: ['largeToolOffloading', 'proactiveSummarization'],
    },
  })
  // --8<-- [end:presets]
}

async function customSummarizationModel() {
  // --8<-- [start:custom_summarization_model]
  const { Agent, Offload } = await import('@strands-agents/sdk')
  const { BedrockModel } = await import('@strands-agents/sdk')

  const agent = new Agent({
    contextManager: {
      strategies: [
        Offload.summarize('*', {
          model: new BedrockModel({ modelId: 'us.amazon.nova-lite-v1:0' }),
          systemPrompt: 'Summarize preserving tool outputs, errors, and IDs.',
        }).when({ utilization: 0.85, preserveRecent: 2 }),
      ],
      stash: false,
    },
  })
  // --8<-- [end:custom_summarization_model]
}

async function storageBackends() {
  // --8<-- [start:storage_backends]
  const { LocalFileStorage, S3Storage } = await import('@strands-agents/sdk/storage')

  // Local filesystem
  const stashLocal = { storage: new LocalFileStorage('./artifacts/') }

  // S3, uses ambient AWS credentials
  const stashS3 = { storage: new S3Storage('my-bucket', { prefix: 'agent-stash/' }) }
  // --8<-- [end:storage_backends]
}
