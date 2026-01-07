import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { pipeline, env } from '@xenova/transformers';

// Skip local model checks for transformers.js to avoid 404s on local dev
env.allowLocalModels = false;

// Singleton to hold models
let imageModel: mobilenet.MobileNet | null = null;
let textClassifier: any = null;

export const aiService = {
    async loadModels() {
        try {
            if (!imageModel) {
                console.log('Loading MobileNet...');
                await tf.ready();
                imageModel = await mobilenet.load();
                console.log('MobileNet loaded');
            }

            if (!textClassifier) {
                console.log('Loading Text Classifier...');
                // Using a small model for zero-shot classification to keep it light
                textClassifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
                console.log('Text Classifier loaded');
            }
        } catch (error) {
            console.error('Error loading AI models:', error);
            throw error;
        }
    },

    async classifyImage(imageElement: HTMLImageElement): Promise<string[]> {
        if (!imageModel) await this.loadModels();

        const predictions = await imageModel!.classify(imageElement);
        return predictions.map(p => p.className);
    },

    async suggestPriority(text: string): Promise<string> {
        if (!text || text.length < 10) return 'medium'; // Not enough context
        if (!textClassifier) await this.loadModels();

        const candidateLabels = ['urgent emergency hazard', 'high priority issue', 'medium concern', 'low priority minor'];

        const output = await textClassifier(text, candidateLabels);

        // output matches: { labels: string[], scores: number[] }
        const topLabel = output.labels[0];

        if (topLabel.includes('urgent')) return 'urgent';
        if (topLabel.includes('high')) return 'high';
        if (topLabel.includes('low')) return 'low';
        return 'medium';
    },

    async suggestCategory(predictions: string[]): Promise<string | null> {
        // Map MobileNet classes to our app categories
        const wasteKeywords = ['bottle', 'plastic', 'trash', 'waste', 'garbage', 'rubbish', 'can', 'paper', 'carton'];
        const pollutionKeywords = ['smoke', 'smog', 'oil', 'spill', 'dirty water', 'sewage'];
        const infrastructureKeywords = ['road', 'pothole', 'bridge', 'building', 'wall', 'construction'];
        const hazardKeywords = ['fire', 'flame', 'accident', 'crash', 'wire', 'electric'];

        const text = predictions.join(' ').toLowerCase();

        if (wasteKeywords.some(k => text.includes(k))) return 'waste';
        if (pollutionKeywords.some(k => text.includes(k))) return 'pollution';
        if (infrastructureKeywords.some(k => text.includes(k))) return 'infrastructure';
        if (hazardKeywords.some(k => text.includes(k))) return 'hazard';

        return null;
    },

    async askGreenOracle(question: string): Promise<string> {
        try {
            // Dynamic import to avoid circular dependency issues if any, or just direct use
            const { supabase } = await import("@/lib/supabase");

            const { data, error } = await supabase.functions.invoke('green-oracle', {
                body: { prompt: question }
            });

            if (error) throw error;
            return data.answer;
        } catch (error) {
            console.error("Error asking GreenOracle:", error);
            throw error;
        }
    }
};
