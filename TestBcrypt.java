import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class TestBcrypt { public static void main(String[] args)
{
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    System.out.println(encoder.matches("Admin@123", "$10$vYlR0OZr5c1hl7V9F5qcmu0w8aAKjnpzZXm8pqHqb.nSXyNm7pCim"));
}
}
