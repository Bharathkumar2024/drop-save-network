import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle } from 'lucide-react';

interface GoogleMapWrapperProps {
    locations?: { lat: number; lng: number; title: string }[];
    height?: string;
    zoom?: number;
}

const GoogleMapWrapper: React.FC<GoogleMapWrapperProps> = ({
    locations = [],
    height = '400px',
    zoom = 12
}) => {
    const [apiKey, setApiKey] = useState<string | null>(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || null);
    const [error, setError] = useState<string | null>(null);

    // Simulation of loading Google Maps script
    useEffect(() => {
        if (!apiKey) {
            // In a real scenario, we would log this
            // setError('API Key missing');
        }
    }, [apiKey]);

    if (!apiKey) {
        return (
            <Card className="glass-card relative overflow-hidden bg-slate-900 border-red-500/20" style={{ height }}>
                {/* Mock Map Background Visual */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="max-w-md text-center bg-background/90 backdrop-blur-md p-6 rounded-xl border border-red-500/30 shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <MapPin className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Real-World Map Integration</h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            To enable live Google Maps tracking for Blood Banks and Donors, please configure your API key.
                        </p>

                        <div className="bg-slate-950 p-3 rounded-lg text-left text-xs font-mono text-green-400 mb-4 overflow-x-auto">
                            VITE_GOOGLE_MAPS_API_KEY=your_key_here
                        </div>

                        <Button variant="outline" className="w-full gap-2" onClick={() => window.open('https://developers.google.com/maps/documentation/javascript/get-api-key', '_blank')}>
                            <AlertTriangle className="h-4 w-4" />
                            Get API Key
                        </Button>
                    </div>
                </div>

                {/* Mock Markers for Visual Flair */}
                {locations.map((loc, i) => (
                    <div
                        key={i}
                        className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"
                        style={{
                            top: `${50 + (Math.random() * 40 - 20)}%`,
                            left: `${50 + (Math.random() * 40 - 20)}%`
                        }}
                    />
                ))}
            </Card>
        );
    }

    return (
        <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Blood+Banks+Near+Me&zoom=${zoom}`}>
            </iframe>
        </div>
    );
};

export default GoogleMapWrapper;
