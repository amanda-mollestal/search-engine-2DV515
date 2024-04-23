import { SearchEngine } from '../handlers/searchEngine'
import { Request, Response, NextFunction } from 'express'

/**
 * Represents a controller that handles search requests.
 */
export class SearchController {

  /**
   * The SearchEngine to query.
   */
  private searchEngine: SearchEngine

  constructor() {
    this.searchEngine = new SearchEngine()
  }

  /**
   * Queries the SearchEngine and returns the results.
   * @param req The request.
   * @param res The response.
   * @param next The next function.
   */
  query(req: Request, res: Response, next: NextFunction) {
    const searchQuery = req.body.query
    if (!searchQuery) {
      res.status(400).json('No search query provided')
      return
    }

    const results = this.searchEngine.query(searchQuery)
    res.status(200).json(results)
  }
}