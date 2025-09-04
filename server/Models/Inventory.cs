using System.ComponentModel.DataAnnotations;

namespace WarpPowerApi.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        
        // Foreign key to User
        public int UserId { get; set; }
        
        // Foreign key to Item
        public int ItemId { get; set; }
        
        // Quantity of this item in the user's inventory
        public int Quantity { get; set; } = 1;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Item Item { get; set; } = null!;
    }
}
