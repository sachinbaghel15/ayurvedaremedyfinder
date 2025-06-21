# Ayurveda Remedy API

A comprehensive REST API for managing Ayurvedic remedies, herbs, and dosha assessments. Built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with role-based access control
- 🌿 **Remedy Management** - CRUD operations for Ayurvedic remedies with reviews and ratings
- 🌱 **Herb Database** - Comprehensive herb information with Ayurvedic properties
- 🧘 **Dosha Assessment** - Interactive dosha assessment and personalized recommendations
- 👥 **User Management** - User profiles with dosha types and health information
- 📊 **Advanced Filtering** - Search, filter, and pagination for all resources
- ✅ **Input Validation** - Comprehensive validation using express-validator
- 🛡️ **Security** - Helmet, CORS, and other security middleware

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Remedies
- `GET /api/remedies` - Get all remedies (with filtering)
- `GET /api/remedies/:id` - Get single remedy
- `POST /api/remedies` - Create new remedy (authenticated)
- `PUT /api/remedies/:id` - Update remedy (authenticated)
- `DELETE /api/remedies/:id` - Delete remedy (authenticated)
- `POST /api/remedies/:id/reviews` - Add review to remedy (authenticated)
- `GET /api/remedies/dosha/:doshaType` - Get remedies by dosha type
- `GET /api/remedies/category/:category` - Get remedies by category

### Herbs
- `GET /api/herbs` - Get all herbs (with filtering)
- `GET /api/herbs/:id` - Get single herb
- `POST /api/herbs` - Create new herb (publisher/admin)
- `PUT /api/herbs/:id` - Update herb (publisher/admin)
- `DELETE /api/herbs/:id` - Delete herb (admin only)
- `GET /api/herbs/category/:category` - Get herbs by category
- `GET /api/herbs/dosha-effect/:doshaType/:effect` - Get herbs by dosha effect

### Doshas
- `GET /api/doshas/info` - Get dosha information
- `GET /api/doshas/assessment` - Get dosha assessment questions
- `POST /api/doshas/assessment` - Submit dosha assessment
- `GET /api/doshas/recommendations/:doshaType` - Get dosha-specific recommendations

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ayurveda-remedy-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ayurveda_remedy
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=30d
   BCRYPT_ROUNDS=12
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env` file

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "doshaType": "vata"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a remedy
```bash
curl -X POST http://localhost:5000/api/remedies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Ginger Tea for Digestion",
    "description": "A warming tea to improve digestion and reduce bloating",
    "ingredients": [
      {"name": "Fresh Ginger", "quantity": "1", "unit": "inch"},
      {"name": "Honey", "quantity": "1", "unit": "tsp"},
      {"name": "Lemon", "quantity": "1/2", "unit": "piece"}
    ],
    "instructions": "Boil water, add sliced ginger, simmer for 5 minutes, strain and add honey and lemon",
    "category": "digestive",
    "suitableFor": ["vata", "kapha"],
    "benefits": ["Improves digestion", "Reduces bloating", "Boosts immunity"]
  }'
```

### Get dosha assessment
```bash
curl -X GET http://localhost:5000/api/doshas/assessment
```

### Submit dosha assessment
```bash
curl -X POST http://localhost:5000/api/doshas/assessment \
  -H "Content-Type: application/json" \
  -d '{
    "answers": ["vata", "vata", "pitta", "kapha", "vata", "pitta", "vata", "pitta"]
  }'
```

## Data Models

### User
- Basic info (name, email, password)
- Dosha type (vata, pitta, kapha, combinations)
- Health profile (age, weight, medical conditions)
- Role-based access (user, publisher, admin)

### Remedy
- Name, description, ingredients
- Preparation instructions and dosage
- Category and difficulty level
- Dosha suitability and benefits
- Reviews and ratings system

### Herb
- Scientific and Sanskrit names
- Ayurvedic properties (rasa, guna, virya, vipaka)
- Dosha effects and therapeutic properties
- Usage instructions and contraindications
- Sustainability and availability information

## Filtering and Pagination

The API supports advanced filtering, sorting, and pagination:

```bash
# Filter remedies by category
GET /api/remedies?category=digestive

# Sort by rating
GET /api/remedies?sort=rating

# Pagination
GET /api/remedies?page=2&limit=10

# Select specific fields
GET /api/remedies?select=name,description,category

# Multiple filters
GET /api/remedies?category=digestive&difficulty=easy&suitableFor[in]=vata,pitta
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace (development only)"
}
```

## Security Features

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting (can be added)
- SQL injection protection (MongoDB)

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

**Note**: This API is for educational and informational purposes. Always consult with qualified healthcare professionals before using any remedies or treatments. 