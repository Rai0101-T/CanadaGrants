// This is a cleaned up version of the routes.ts file after fixing the assist endpoint
// Generate application assistance
apiRouter.post("/grantscribe/assist", isAuthenticated, async (req: Request, res: Response) => {
  // Import the fixed implementation
  const { handleAssistEndpoint } = await import('./services/fixed-assist-endpoint');
  
  // Use the fixed implementation
  return handleAssistEndpoint(req, res);
});