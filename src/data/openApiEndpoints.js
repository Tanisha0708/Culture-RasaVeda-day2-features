/**
 * Static Open Recipe API reference — used by the docs page only.
 * Each entry includes request/response example payloads (JSON-serializable).
 */
export const openApiEndpoints = [
  {
    id: "list-recipes",
    method: "GET",
    path: "/v1/recipes",
    description:
      "List all recipes in the public catalog. Supports optional query filters.",
    requestExample: {
      query: { region: "Kashmir", limit: 10, offset: 0 },
      note: "Query parameters are optional.",
    },
    responseExample: {
      data: [
        {
          id: 1,
          name: "Rogan Josh",
          region: "Kashmir",
          community: "Kashmiri Pandit",
          dietaryTag: "Non-Veg",
          language: "Kashmiri",
          description: "A slow-cooked lamb curry",
        },
      ],
      meta: { total: 1, limit: 10, offset: 0 },
    },
  },
  {
    id: "get-recipe",
    method: "GET",
    path: "/v1/recipes/:id",
    description: "Fetch a single recipe by numeric id.",
    requestExample: {
      pathParams: { id: 1 },
    },
    responseExample: {
      data: {
        id: 1,
        name: "Rogan Josh",
        region: "Kashmir",
        community: "Kashmiri Pandit",
        dietaryTag: "Non-Veg",
        language: "Kashmiri",
        description: "A slow-cooked lamb curry",
      },
    },
  },
  {
    id: "search-recipes",
    method: "GET",
    path: "/v1/recipes/search",
    description: "Full-text search across recipe names and descriptions.",
    requestExample: {
      query: { q: "dosa", lang: "en" },
    },
    responseExample: {
      data: [{ id: 42, name: "Masala Dosa", region: "South India" }],
      meta: { query: "dosa", count: 1 },
    },
  },
  {
    id: "submit-recipe",
    method: "POST",
    path: "/v1/recipes",
    description:
      "Submit a new community recipe (requires API key). Returns pending review id.",
    requestExample: {
      headers: { Authorization: "Bearer <API_KEY>", "Content-Type": "application/json" },
      body: {
        name: "Pesarattu",
        region: "Andhra Pradesh",
        language: "Telugu",
        dietaryTag: "Vegetarian",
        ingredients: ["green moong", "ginger", "green chili"],
        steps: ["Soak dal", "Grind batter", "Spread on tawa"],
      },
    },
    responseExample: {
      data: {
        submissionId: "sub_8f2a1c",
        status: "pending_review",
        submittedAt: "2026-04-10T12:00:00Z",
      },
    },
  },
  {
    id: "translation-queue",
    method: "GET",
    path: "/v1/translations/pending",
    description:
      "List recipes awaiting translation for a target language (translator role).",
    requestExample: {
      query: { targetLanguage: "Tamil", status: "pending_translation" },
    },
    responseExample: {
      data: [
        {
          id: 201,
          name: "Rasam",
          targetLanguage: "Tamil",
          status: "pending_translation",
        },
      ],
    },
  },
  {
    id: "health",
    method: "GET",
    path: "/v1/health",
    description: "Liveness check for integrations and monitors.",
    requestExample: null,
    responseExample: {
      status: "ok",
      service: "open-recipe-api",
      version: "1.0.0",
    },
  },
];
