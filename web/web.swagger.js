/**
 * @swagger
 * /list/{page}:
 *    get:
 *      summary: Search
 *       - application/json
 *      tags: [News]
 *      parameters:
 *       - name: page
 *         description: pagenumber first page=1
 *         in: path
 *         required: true
 *         type: string
 *      properties:
 *        id:
 *          type: string
 *      responses:
 *       200:
 *         description: "{status: ok}"
 */

/**
 * @swagger
 * /list/:
 *    get:
 *      summary: List all news
 *      produces:
 *       - application/json
 *      tags: [News]
 *      responses:
 *       200:
 *         description: "{status: ok}"
 */

/**
 * @swagger
 * /update/:
 *    get:
 *      summary: Update status
 *      produces:
 *       - application/json
 *      tags: [News]
 *      responses:
 *       200:
 *         description: "{status: ok}"
 */

/**
 * @swagger
 * /position/list/:
 *    get:
 *      summary: Position List
 *       - application/json
 *      tags: [News]
 *      responses:
 *       200:
 *         description: "{status: ok}"
 */

/**
 * @swagger
 * /search/{text}:
 *    get:
 *      summary: Search
 *       - application/json
 *      tags: [News]
 *      parameters:
 *       - name: text
 *         description: Search text
 *         in: path
 *         required: true
 *         type: string
 *      properties:
 *        id:
 *          type: string
 *      responses:
 *       200:
 *         description: "{status: ok}"
 */
