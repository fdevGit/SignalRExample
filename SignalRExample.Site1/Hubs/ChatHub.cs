using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace SignalRExample.Site1.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine($"{Context.ConnectionId}-All-{message}");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMessageToUser(string user, string targetConnectionId, string message)
        {
            Console.WriteLine($"{Context.ConnectionId}-{targetConnectionId}-{message}");
            await Clients.User(targetConnectionId).SendAsync("ReceiveMessage", user, targetConnectionId, message);
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

    }
}
