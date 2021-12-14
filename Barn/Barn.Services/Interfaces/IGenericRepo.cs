using System.Collections.Generic;

namespace Barn.Services.Interfaces
{
    public interface IGenericRepo <K,V>
    {
        V GetById(K id);
        IEnumerable<V> GetAll();
        bool Insert(V entity);
        bool Update(V entity);
        bool Delete(K id);
    }
}
