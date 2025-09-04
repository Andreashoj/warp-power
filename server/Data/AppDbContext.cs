using Microsoft.EntityFrameworkCore;
using WarpPowerApi.Models;

namespace WarpPowerApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });
            
            // Configure Item entity
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Image).HasMaxLength(500);
            });
            
            // Configure Inventory entity and relationships
            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                // Configure foreign key relationships
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Inventories)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(e => e.Item)
                    .WithMany(i => i.Inventories)
                    .HasForeignKey(e => e.ItemId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                // Ensure unique combination of UserId and ItemId
                entity.HasIndex(e => new { e.UserId, e.ItemId })
                    .IsUnique();
            });
            
            // Seed data
            SeedData(modelBuilder);
        }
        
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Alice", Credit = 100 },
                new User { Id = 2, Name = "Bob", Credit = 75 },
                new User { Id = 3, Name = "Charlie", Credit = 150 }
            );
            
            // Seed Items
            modelBuilder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "Fish Treat", Image = "🐟", Value = 10 },
                new Item { Id = 2, Name = "Chicken Treat", Image = "🍗", Value = 15 },
                new Item { Id = 3, Name = "Milk", Image = "🥛", Value = 5 },
                new Item { Id = 4, Name = "Yarn Ball", Image = "🧶", Value = 20 },
                new Item { Id = 5, Name = "Catnip", Image = "🌿", Value = 25 },
                new Item { Id = 6, Name = "Toy Mouse", Image = "🐭", Value = 12 }
            );
            
            // Seed Inventory (User-Item relationships)
            modelBuilder.Entity<Inventory>().HasData(
                new Inventory { Id = 1, UserId = 1, ItemId = 1, Quantity = 3 }, // Alice has 3 Fish Treats
                new Inventory { Id = 2, UserId = 1, ItemId = 3, Quantity = 2 }, // Alice has 2 Milk
                new Inventory { Id = 3, UserId = 1, ItemId = 4, Quantity = 1 }, // Alice has 1 Yarn Ball
                new Inventory { Id = 4, UserId = 2, ItemId = 2, Quantity = 2 }, // Bob has 2 Chicken Treats
                new Inventory { Id = 5, UserId = 2, ItemId = 5, Quantity = 1 }, // Bob has 1 Catnip
                new Inventory { Id = 6, UserId = 3, ItemId = 1, Quantity = 5 }, // Charlie has 5 Fish Treats
                new Inventory { Id = 7, UserId = 3, ItemId = 6, Quantity = 3 }  // Charlie has 3 Toy Mice
            );
        }
    }
}
