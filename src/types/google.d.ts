declare namespace gapi {
  function load(api: string, callback: () => void): void;

  namespace client {
    function init(config: {
      apiKey: string;
      discoveryDocs: string[];
    }): Promise<void>;

    function setToken(token: { access_token: string } | null): void;

    function request<T>(config: {
      path: string;
      method: string;
      params?: Record<string, string>;
      body?: any;
    }): Promise<{ result: T; body: string }>;

    namespace drive {
      namespace files {
        function list(params: {
          pageSize?: number;
          fields?: string;
          q?: string;
          orderBy?: string;
        }): Promise<{
          result: {
            files: Array<{
              id?: string;
              name?: string;
              mimeType?: string;
              modifiedTime?: string;
            }>;
          };
        }>;

        function exportFile(params: {
          fileId: string;
          mimeType: string;
        }): Promise<{
          body: string;
        }>;

        function update(params: {
          fileId: string;
          media: {
            mimeType: string;
            body: string;
          };
        }): Promise<{
          result: {
            id?: string;
            name?: string;
            modifiedTime?: string;
          };
        }>;

        function create(params: {
          resource: {
            name: string;
            mimeType: string;
          };
          media?: {
            mimeType: string;
            body: string;
          };
          fields?: string;
        }): Promise<{
          result: {
            id?: string;
            name?: string;
            modifiedTime?: string;
          };
        }>;
      }
    }

    namespace docs {
      namespace documents {
        interface DocumentContent {
          body: {
            content: Array<{
              endIndex: number;
              startIndex: number;
              paragraph?: {
                elements: Array<{
                  endIndex: number;
                  startIndex: number;
                  textRun?: {
                    content: string;
                  };
                }>;
              };
            }>;
          };
          documentId: string;
          title: string;
        }

        function get(params: {
          documentId: string;
        }): Promise<{
          result: DocumentContent;
        }>;

        function batchUpdate(params: {
          documentId: string;
          resource: {
            requests: Array<{
              deleteContentRange?: {
                range: {
                  startIndex: number;
                  endIndex: number;
                };
              };
              insertText?: {
                location: {
                  index: number;
                };
                text: string;
              };
            }>;
          };
        }): Promise<{
          result: {
            documentId: string;
          };
        }>;
      }
    }
  }
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        error?: string;
      }

      interface TokenClient {
        callback: (response: TokenResponse) => void;
        requestAccessToken(): void;
      }

      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: string;
      }): TokenClient;
    }
  }
} 