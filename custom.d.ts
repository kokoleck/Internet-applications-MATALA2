declare namespace Express {
    export interface Request {
      user?: { userId: string }; // כאן אתה מציין את טיפוס המידע שצפוי להיות בתוך req.user
    }
  }
  