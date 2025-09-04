namespace WarpPowerApi.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Credit { get; set; }
        public List<InventoryItemDto> Inventory { get; set; } = new List<InventoryItemDto>();
    }

    public class InventoryItemDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string ItemImage { get; set; } = string.Empty;
        public int ItemValue { get; set; }
        public int Quantity { get; set; }
    }

    public class ItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public int Value { get; set; }
    }
}
