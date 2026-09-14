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
