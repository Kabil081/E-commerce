package main.com.example.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@SpringBootApplication
public class ECommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ECommerceApplication.class, args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// Models
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
class User {
    @Id
    private String id;
    private String email;
    private String password;

    // Getters and setters...
}

@Document
class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String imageUrl;

    // Getters and setters...
}

@Document
class Cart {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items = new ArrayList<>();
    private double total;

    // Getters and setters...
}

class CartItem {
    private String productId;
    private String name;
    private double price;
    private int quantity;

    // Getters and setters...
}

// Repositories
interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}

interface ProductRepository extends MongoRepository<Product, String> {}

interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserId(String userId);
}

// Services
@Service
class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

@Service
class CartService {
    @Autowired
    private CartRepository cartRepository;

    public Cart addToCart(String userId, String productId, String name, double price, int quantity) {
        Cart cart = cartRepository.findByUserId(userId).orElse(new Cart());
        cart.setUserId(userId);
        List<CartItem> items = cart.getItems();
        Optional<CartItem> existingItem = items.stream().filter(i -> i.getProductId().equals(productId)).findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setProductId(productId);
            item.setName(name);
            item.setPrice(price);
            item.setQuantity(quantity);
            items.add(item);
        }

        cart.setTotal(items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum());
        return cartRepository.save(cart);
    }
}

// Controllers
@RestController
@RequestMapping("/api")
class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        userService.register(email, password);
        return ResponseEntity.ok(Map.of("message", "Sign-Up Successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> user = userService.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String token = Jwts.builder()
                .setSubject(user.get().getId())
                .signWith(SignatureAlgorithm.HS256, "jwt.secret")
                .compact();
            return ResponseEntity.ok(Map.of("token", token));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}

@RestController
@RequestMapping("/api/products")
class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        productRepository.save(product);
        return ResponseEntity.status(201).body(Map.of("message", "Product Added Successfully!"));
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }
}

@RestController
@RequestMapping("/api/cart")
class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String productId = (String) body.get("productId");
        String name = (String) body.get("name");
        double price = (double) body.get("price");
        int quantity = (int) body.get("quantity");

        cartService.addToCart(userId, productId, name, price, quantity);
        return ResponseEntity.ok(Map.of("message", "Added to cart"));
    }
}
