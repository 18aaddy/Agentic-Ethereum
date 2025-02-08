// api-client.js

class ChessApiClient {
  constructor(
    baseUrl = "http://127.0.0.1:5000"
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a move on the chess board
   * @param {number} fromX - Starting X coordinate
   * @param {number} fromY - Starting Y coordinate
   * @param {number} toX - Destination X coordinate
   * @param {number} toY - Destination Y coordinate
   * @param {string} color - Color of the piece ('white' or 'black')
   * @returns {Promise} Response from the server
   */
  async makeMove(fromX, fromY, toX, toY) {
    let color = "black";
    try {
      // Validate input types before making the request
      if (
        !Number.isInteger(fromX) ||
        !Number.isInteger(fromY) ||
        !Number.isInteger(toX) ||
        !Number.isInteger(toY) ||
        typeof color !== "string"
      ) {
        throw new Error("Invalid parameter types");
      }

      fromY = 7 - fromY;
      toY = 7 - toY;

      const response = await fetch(`${this.baseUrl}/api/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromX,
          fromY,
          toX,
          toY,
          color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to make move");
      }

      return await response.json();
    } catch (error) {
      console.error("Error making move:", error.message);
      throw error;
    }
  }
}

// //   Example usage:
//   const chessApi = new ChessApiClient();
//   try {
//     const result = await chessApi.makeMove(4, 6, 4, 5, 'black');
//     console.log('Move successful:', result);
//   } catch (error) {
//     console.error('Failed to make move:', error);
//   }

export default ChessApiClient;
