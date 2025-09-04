using System.ComponentModel.DataAnnotations;

namespace WarpPowerApi.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public int Credit { get; set; }
        
        // Navigation property
        public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}
