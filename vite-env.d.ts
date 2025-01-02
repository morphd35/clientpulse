interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // Add more environment variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string; // Ensure the variable name matches your `.env` file
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

