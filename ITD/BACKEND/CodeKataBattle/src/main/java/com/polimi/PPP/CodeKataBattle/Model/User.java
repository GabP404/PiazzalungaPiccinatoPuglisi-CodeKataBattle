package com.polimi.PPP.CodeKataBattle.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Column(nullable = false, length = 256)
    @NotBlank(message = "Surname is mandatory")
    private String surname;

    @Column(nullable = false, length = 256)
    @NotBlank(message = "Password is mandatory")
    private String password;

    @Column(nullable = false,unique = true, length = 256)
    @Email(message = "Email should be valid")
    private String email;

    @Column(nullable = false,unique = true, length = 50)
    @NotBlank(message = "Username is mandatory")
    private String username;

    @Column(name = "link_bio")
    private String linkBio;

    // Many users can have one role, hence ManyToOne relationship is used
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id") // role_id is the foreign key in the users table
    private Role role;

    // Other fields and methods...
}