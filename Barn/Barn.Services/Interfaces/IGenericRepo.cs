using System.Collections.Generic;
using System.Threading.Tasks;

namespace Barn.Services.Interfaces
{
    public interface IGenericRepo <K,V>
    {
        IEnumerable<V> GetAll();
        Task<V> GetAsyncById(K id);
        Task<bool> InsertAsync(V entity);
        Task<bool> UpdateAsync(V entity);
        Task DeleteAsync(K id);
    }
}
