using System.ComponentModel.DataAnnotations;

namespace WarpPowerApi.Models
{
    public class Item
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Image { get; set; } = string.Empty;
        
        public int Value { get; set; }
        
        // Navigation property
        public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}
