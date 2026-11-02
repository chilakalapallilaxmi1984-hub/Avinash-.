import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support base64 image and video payloads up to 35MB
  app.use(express.json({ limit: '35mb' }));

  // 1. AI Storyboard & Cinematic Motion Director (Free-tier Gemini 3.8 Flash)
  app.post('/api/ai/storyboard', async (req, res) => {
    try {
      const {
        prompt = '',
        style = 'Cinematic',
        duration = 10,
        aspectRatio = '16:9',
        cameraMotion = 'Orbital Drone Sweep',
      } = req.body;

      const ai = getAIClient();
      const sceneCount = Math.max(2, Math.min(6, Math.ceil(Number(duration) / 5)));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Create a high-end ${duration}-second ${style} AI video production blueprint for this concept: "${prompt}". Aspect ratio: ${aspectRatio}. Camera style: ${cameraMotion}. Split into ${sceneCount} sequential scenes.`,
        config: {
          systemInstruction:
            'You are AVINASH AI, an award-winning futuristic film director and visual effects supervisor. Return strictly structured JSON with vivid visual detail, rich color palettes (hex codes), dramatic lighting notes, narration voiceover script, and timestamped subtitles.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Compelling cinematic title' },
              enhancedPrompt: { type: Type.STRING, description: 'Master-grade expanded visual prompt' },
              voiceoverScript: { type: Type.STRING, description: 'Concise dramatic narration matching the video duration' },
              colorPalette: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 hex colors matching the mood (e.g. #00F0FF, #7C3AED, #EC4899, #090D16)',
              },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.INTEGER },
                    startTime: { type: Type.NUMBER },
                    endTime: { type: Type.NUMBER },
                    visualDescription: { type: Type.STRING },
                    cameraDirective: { type: Type.STRING },
                    subtitleText: { type: Type.STRING },
                    accentHex: { type: Type.STRING },
                  },
                  required: [
                    'sceneNumber',
                    'startTime',
                    'endTime',
                    'visualDescription',
                    'cameraDirective',
                    'subtitleText',
                    'accentHex',
                  ],
                },
              },
            },
            required: ['title', 'enhancedPrompt', 'voiceoverScript', 'colorPalette', 'scenes'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({ ok: true, blueprint: parsed });
    } catch (error: any) {
      console.error('Storyboard generation error:', error);
      res.status(500).json({
        ok: false,
        error: error?.message || 'Failed to generate AI storyboard.',
      });
    }
  });

  // 2. Real AI Video Generation via Gemini Omni 1.1 Flash (Text-to-Video & Image-to-Video)
  app.post('/api/ai/generate-video', async (req, res) => {
    try {
      const {
        prompt,
        style = 'Cinematic',
        duration = 5,
        aspectRatio = '16:9',
        quality = '1080p',
        imageBase64,
        imageMimeType = 'image/png',
        cameraMotion = 'Smooth Cinematic Push-In',
      } = req.body;

      if (!prompt && !imageBase64) {
        res.status(400).json({ ok: false, error: 'Prompt or input image is required.' });
        return;
      }

      const ai = getAIClient();

      // Map user parameters to Omni Flash supported values
      const mappedAspectRatio = aspectRatio === '9:16' || aspectRatio === '3:4' || aspectRatio === '4:5' ? '9:16' : '16:9';
      const mappedDuration = Number(duration) >= 10 ? '10s' : '5s';
      const mappedResolution =
        quality === '4K' ? '4k' : quality === '1080p' || quality === '2K' ? '1080p' : '720p';

      const fullPrompt = `${style} style, ${cameraMotion}, ultra-detailed smooth motion: ${prompt || 'Animate this scene with realistic atmospheric motion and cinematic lighting.'}`;

      const inputPayload: any = imageBase64
        ? [
            {
              type: 'image',
              mime_type: imageMimeType,
              data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
            },
            {
              type: 'text',
              text: fullPrompt,
            },
          ]
        : fullPrompt;

      const interaction = await ai.interactions.create(
        {
          model: 'gemini-omni-1.1-flash',
          input: inputPayload,
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: 'video',
            aspect_ratio: mappedAspectRatio,
            duration: mappedDuration,
            resolution: mappedResolution,
          } as any,
        },
        { timeout: 300000 }
      );

      const videoPart = interaction.output_video;
      if (videoPart?.data) {
        const mimeType = videoPart.mime_type || 'video/mp4';
        res.json({
          ok: true,
          engine: 'gemini-omni-1.1-flash',
          videoDataUrl: `data:${mimeType};base64,${videoPart.data}`,
          mimeType,
        });
        return;
      }

      if (videoPart?.uri) {
        res.json({
          ok: true,
          engine: 'gemini-omni-1.1-flash',
          videoDataUrl: videoPart.uri,
          mimeType: videoPart.mime_type || 'video/mp4',
        });
        return;
      }

      res.status(502).json({
        ok: false,
        code: 'NO_VIDEO_OUTPUT',
        error: 'Cloud video model returned empty video payload.',
      });
    } catch (error: any) {
      console.error('Omni Flash video error:', error?.message || error);
      const status = error?.status || 500;
      const msg = String(error?.message || 'Cloud video generation failed.');
      const isQuotaOrPaid =
        status === 429 ||
        status === 403 ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('billing') ||
        msg.includes('paid');

      res.status(status >= 400 && status < 600 ? status : 500).json({
        ok: false,
        requiresFreeEngineFallback: isQuotaOrPaid,
        error: msg,
      });
    }
  });

  // 3. AI Voice Generator & Text-to-Speech (Free-tier Gemini 3.8 Flash Lite TTS)
  app.post('/api/ai/tts', async (req, res) => {
    try {
      const {
        text,
        voice = 'Kore',
        style = 'Cinematic, expressive film narrator',
      } = req.body;

      if (!text || !String(text).trim()) {
        res.status(400).json({ ok: false, error: 'Script text is required for voice generation.' });
        return;
      }

      const ai = getAIClient();
      const interaction = await ai.interactions.create({
        model: 'gemini-3.8-flash-lite-tts',
        input: [
          {
            type: 'text',
            text: String(text).trim(),
            annotations: [
              {
                type: 'speech_metadata',
                style,
              },
            ],
          } as any,
        ],
        response_format: { type: 'audio' } as any,
        generation_config: {
          speech_config: [
            {
              language: 'en-US',
              voice,
            },
          ],
        } as any,
      });

      const audio = interaction.output_audio;
      if (audio?.data) {
        const mimeType = audio.mime_type || 'audio/wav';
        res.json({
          ok: true,
          audioDataUrl: `data:${mimeType};base64,${audio.data}`,
          mimeType,
        });
        return;
      }

      res.status(502).json({ ok: false, error: 'No audio returned by Gemini TTS.' });
    } catch (error: any) {
      console.error('TTS error:', error?.message || error);
      res.status(500).json({
        ok: false,
        error: error?.message || 'Voice synthesis failed.',
      });
    }
  });

  // 4. Automatic Subtitles Generator (Gemini 3.8 Flash)
  app.post('/api/ai/subtitles', async (req, res) => {
    try {
      const { script, duration = 10 } = req.body;
      const ai = getAIClient();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate accurately timed video subtitles spanning 0 to ${duration} seconds for this narration/concept: "${script}".`,
        config: {
          systemInstruction:
            'Break the text into concise, punchy subtitle captions (max 9 words per cue) evenly timed across the requested video duration.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                start: { type: Type.NUMBER },
                end: { type: Type.NUMBER },
                text: { type: Type.STRING },
              },
              required: ['start', 'end', 'text'],
            },
          },
        },
      });

      const cues = JSON.parse((response.text ?? '[]').trim());
      res.json({ ok: true, subtitles: cues });
    } catch (error: any) {
      console.error('Subtitles error:', error?.message || error);
      res.status(500).json({ ok: false, error: error?.message || 'Subtitle generation failed.' });
    }
  });

  // 5. AI Image Generator (Gemini 3.1 Flash Lite Image with procedural SVG fallback info)
  app.post('/api/ai/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio = '16:9' } = req.body;
      if (!prompt) {
        res.status(400).json({ ok: false, error: 'Image prompt is required.' });
        return;
      }

      const ai = getAIClient();
      const supportedRatio = ['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio)
        ? aspectRatio
        : '16:9';

      const interaction = await ai.interactions.create({
        model: 'gemini-3.1-flash-lite-image',
        input: prompt,
        response_modalities: ['image', 'text'],
        generation_config: {
          image_config: {
            aspect_ratio: supportedRatio,
          },
        } as any,
      });

      for (const step of interaction.steps || []) {
        if (step.type === 'model_output') {
          const imageContent = step.content?.find((c: any) => c.type === 'image');
          if (imageContent && (imageContent as any).data) {
            const mime = (imageContent as any).mime_type || 'image/png';
            res.json({
              ok: true,
              imageDataUrl: `data:${mime};base64,${(imageContent as any).data}`,
            });
            return;
          }
        }
      }

      if (interaction.output_image?.data) {
        const mime = interaction.output_image.mime_type || 'image/png';
        res.json({
          ok: true,
          imageDataUrl: `data:${mime};base64,${interaction.output_image.data}`,
        });
        return;
      }

      res.status(502).json({ ok: false, error: 'Image model returned no image data.' });
    } catch (error: any) {
      console.error('AI Image generation error:', error?.message || error);
      res.status(500).json({
        ok: false,
        requiresFreeFallback: true,
        error: error?.message || 'Cloud image generation requires a billing-enabled key.',
      });
    }
  });

  // 6. AI Music Generator via Lyria Clip Preview
  app.post('/api/ai/generate-music', async (req, res) => {
    try {
      const { prompt = 'Futuristic cyberpunk synthwave cinematic soundtrack with deep bass' } = req.body;
      const ai = getAIClient();

      const response = await ai.models.generateContentStream({
        model: 'lyria-3-clip-preview',
        contents: `Generate a 30-second instrumental track: ${prompt}`,
        config: {
          responseModalities: [Modality.AUDIO],
        },
      });

      let audioBase64 = '';
      let mimeType = 'audio/wav';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
        }
      }

      if (!audioBase64) {
        res.status(502).json({ ok: false, error: 'No music audio returned.' });
        return;
      }

      res.json({
        ok: true,
        audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
        mimeType,
      });
    } catch (error: any) {
      console.error('Music generation error:', error?.message || error);
      res.status(500).json({
        ok: false,
        requiresFreeSynthFallback: true,
        error: error?.message || 'Lyria cloud music requires a paid API key; switching to WebAudio Studio Synth.',
      });
    }
  });

  // 7. AI Prompt Enhancer & Story Script Writer (Free-tier Gemini 3.8 Flash)
  app.post('/api/ai/enhance-prompt', async (req, res) => {
    try {
      const { prompt, style = 'Cinematic' } = req.body;
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Enhance this video generation prompt into a breathtaking, detailed ${style} cinematography prompt under 75 words: "${prompt}"`,
        config: {
          systemInstruction:
            'Output ONLY the enhanced prompt text with camera lens, lighting, motion dynamics, and atmosphere details. No quotes or preamble.',
        },
      });
      res.json({ ok: true, enhancedPrompt: (response.text || prompt).trim() });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error?.message || 'Prompt enhancement failed.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AVINASH AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
