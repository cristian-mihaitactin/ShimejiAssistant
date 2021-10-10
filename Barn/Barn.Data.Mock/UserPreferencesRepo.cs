﻿using Barn.Entities;
using Barn.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barn.Data.Mock
{
    public class UserPreferencesRepo : IGenericRepo<Guid, UserPreferences>
    {
        private IList<UserPreferences> _userPrefDB = new List<UserPreferences>();

        public bool Delete(UserPreferences entity)
        {
            return _userPrefDB.Remove(entity);
        }

        public IEnumerable<UserPreferences> GetAll()
        {
            return _userPrefDB;
        }

        public UserPreferences GetById(Guid id)
        {
            return _userPrefDB.Where(u => u.Id == id).FirstOrDefault();
        }

        public bool Insert(UserPreferences entity)
        {
            if (!_userPrefDB.Contains(entity))
            {
                _userPrefDB.Add(entity);
            }
            else
            {
                return false;
            }

            return true;
        }

        public bool Update(UserPreferences entity)
        {
            if (!_userPrefDB.Contains(entity))
            {
                return false;

            }

            var existingEntitiy = _userPrefDB.Where(u => u.Id == entity.Id).FirstOrDefault();
            if (existingEntitiy == null)
            {
                return false;
            }

            _userPrefDB[_userPrefDB.IndexOf(existingEntitiy)] = entity;

            return true;
        }
    }
}
