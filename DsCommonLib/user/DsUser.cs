using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HQLib.Interface;
using HQLib.Util;

namespace DsCommonLib.user
{
    public class DsUser : IDatasource
    {
        /// <summary>
        /// 员工编号
        /// </summary>
        public string userid { get; set; }

        /// <summary>
        /// 员工姓名
        /// </summary>
        public string username { get; set; }

        /// <summary>
        /// 员工口令
        /// </summary>
        public string userpwd {get;set;}

        /// <summary>
        /// 用户类型 系统管理员 一般管理员
        /// </summary>
        public string usertype { get; set; }

        /// <summary>
        /// 用户部门名称
        /// </summary>
        public string userdeptname { get; set; }

        /// <summary>
        /// 用户部门编号
        /// </summary>
        public string userdeptid { get; set; }

        public DsUser()
        {

        }

        public string ToJson()
        {
            return Utils.ConvertToJson(this);
        }
    }
}
