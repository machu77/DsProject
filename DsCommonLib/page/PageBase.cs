using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using HQLib.Util;
using HQLib;
using System.Threading;
using System.Reflection;
using DsCommonLib.user;

namespace DsCommonLib.page
{
    public class PageBase : System.Web.UI.Page
    {
        /// <summary>
        /// 员工工号
        /// </summary>
        public string userid { get; set; }

        public string username { get; set; }

        public string usertype { get; set; }

        /// <summary>
        /// 部门编号
        /// </summary>
        public string deptid { get; set; }

        public string deptname { get; set; }

        // 页面参数
        private NameValueCollection _parameters = null;

        // 页面脚本集合
        private NameValueCollection _scripts = null;

        //页面数据源集合
        private NameValueCollection _datasources = null;

        public PageBase()
        {
            _parameters = new NameValueCollection();
            _scripts = new NameValueCollection();
            _datasources = new NameValueCollection();
        }

        /// <summary>
        /// 获取当前请求的页面参数
        /// </summary>
        public NameValueCollection Parameters
        {
            get { return _parameters; }
        }

        /// <summary>
        /// 获取当前请求的事件名称
        /// </summary>
        protected string CurrentEvent
        {
            get { return Request["event"] ?? string.Empty; }
        }

        /// <summary>
        /// 获取或设置当前请求的页面参数是否去除头尾空格
        /// </summary>
        protected virtual bool EnableTrim
        {
            get { return true; }
        }

        /// <summary>
        /// 获取当前请求是否为页面回调请求
        /// </summary>
        protected new bool IsPostBack
        {
            get { return CurrentEvent.Length > 0 ? true : false; }
        }

        /// <summary>
        /// 获取当前请求是否执行PageLoad事件
        /// </summary>
        protected bool DoPageLoad
        {
            get { return Convert.ToBoolean(Request["page_load"] ?? "True"); }
        }


        /// <summary>
        /// 在当前页面注册脚本
        /// </summary>
        /// <param name="name">脚本名称</param>
        /// <param name="script">脚本内容</param>
        protected void RegisterScript(string name, string script)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentNullException("name不能为空");
            }

            if (string.IsNullOrEmpty(script))
            {
                throw new ArgumentNullException("sciprt不能为空");
            }

            // 头尾添加script标记
            if (!script.StartsWith("<script>", true, null))
            {
                script = "<script>" + script;
            }

            if (!script.EndsWith("</script>", true, null))
            {
                script += "</script>";
            }

            _scripts.Add(name, script);
        }

        protected void Server_Alert(string message)
        {
            string alertmessage = "";
            alertmessage = "alert('" + message + "');";
            RegisterScript("message", alertmessage);
        }

        protected void Server_Error(ErrorEntity ErrInfo)
        {
            Server_Alert("错误编号:[" + ErrInfo.ErrorCode + "],错误原因:" + ErrInfo.ErrorMessage);
        }

        /// <summary>
        /// 将键值对应信息转换为简单JSON格式信息并输出到当前页面
        /// </summary>
        /// <param name="message">键值对应信息</param>
        protected void WriteJson(Dictionary<string, string> message)
        {
            StringBuilder appender = new StringBuilder();
            appender.Append("{");
            foreach (KeyValuePair<string, string> keyValue in message)
            {
                appender.Append(string.Format("{0}:'{1}',", keyValue.Key, Utils.FormatString(keyValue.Value)));
            }

            appender.Remove(appender.Length - 1, 1);
            appender.Append("}");
            Response.Write(appender.ToString());
            Response.End();
        }

        /// <summary>
        /// 向当前页面添加数据源
        /// </summary>
        /// <param name="name">数据源名称</param>
        /// <param name="datasource">数据源内容</param>
        public void AddDatasource(string name, object datasource)
        {
            if (_datasources.AllKeys.Contains(name))
            {
                throw new ArgumentException(string.Format("已存在name为{0}的数据源", name));
            }
            _datasources.Add(name, Utils.ConvertToJson(datasource));
        }

        /// <summary>
        /// 向当前页面添加数据源
        /// </summary>
        /// <param name="name">数据源名称</param>
        /// <param name="datasource">数据源内容（JSON格式）</param>
        protected void AddDatasource(string name, string datasource)
        {
            if (_datasources.AllKeys.Contains(name))
            {
                throw new ArgumentException(string.Format("已存在name为{0}的数据源", name));
            }

            _datasources.Add(name, datasource);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            //调试解析，设置用户
            if (!Page.IsPostBack)
            {
                Session["adminId"] = "23201240400";
                Session["adminName"] = "郑月侨";
                Session["adminPwd"] = "123456";
                Session["adminType"] = "系统管理员";
                Session["adminSwjg"] = "如东地税一分局";
                Session["adminRzjgdm"] = "23201240400";
            }

        }

        protected DsUser GetUserInfo()
        {
            if (Session["adminId"] != null)
            {
                DsUser userinfo = new DsUser();
                userinfo.userid = Session["adminId"].ToString();
                userinfo.username = Session["adminName"].ToString();
                userinfo.userpwd = Session["adminPwd"].ToString();
                userinfo.usertype = Session["adminType"].ToString();
                userinfo.userdeptname = Session["adminSwjg"].ToString();
                userinfo.userdeptid = Session["adminRzjgdm"].ToString();
                return userinfo;
            }
            else
            {
                return null;
            }
        }

        //需要定义
        protected override void OnPreLoad(EventArgs e)
        {
            ErrorEntity ErrInfo = new ErrorEntity();
            try
            {
                if (!Page.IsPostBack)
                {
                    //判断是否登录
                    DsUser userInfo = GetUserInfo();
                    if (userInfo == null)
                    {
                        userid = "0";
                        RegisterScript("redirect", "redirecturl();");
                        //Response.Redirect("~/assesssystem/login.aspx");
                    }
                    else
                    {
                        userid = userInfo.userid;
                        username = userInfo.username;
                        usertype = userInfo.usertype;
                        deptid = userInfo.userdeptid;
                        deptname = userInfo.userdeptname;
                    }
                }
                
                // 处理页面参数
                if (EnableTrim)
                {
                    NameValueCollection nv = new NameValueCollection();

                    for (int i = 0; i < Request.QueryString.Count; i++)
                    {
                        nv.Add(Request.QueryString.Keys[i], Request.QueryString[i].Trim());
                    }

                    this._parameters.Add(nv);

                    nv = new NameValueCollection();

                    for (int i = 0; i < Request.Form.Count; i++)
                    {
                        nv.Add(Request.Form.Keys[i], Request.Form[i].Trim());
                    }

                    this._parameters.Add(nv);
                }
                else
                {
                    this._parameters.Add(Request.QueryString);
                    this._parameters.Add(Request.Form);
                }

                // 处理事件
                if (CurrentEvent.Length > 0)
                {
                    Type type = this.GetType();
                    MethodInfo method = type.GetMethod(CurrentEvent);
                    if (method == null)
                    {
                        throw new ArgumentException(string.Format("事件{0}不存在或方法签名错误，事件方法必须无参数和无返回值", CurrentEvent));
                    }

                    try
                    {
                        method.Invoke(this, null);
                        if (!DoPageLoad)
                        {
                            // 当前请求不执行PageLoad，结束请求
                            EndResponse();
                        }
                    }
                    catch (ThreadAbortException abEx)
                    {
                        throw abEx;
                    }
                    catch (Exception ex)
                    {
                        throw new Exception(string.Format("事件{0}时执行异常", CurrentEvent), ex);
                    }
                }
            }
            catch (ThreadAbortException abEx)
            {
                throw abEx;
            }
            catch (Exception ex)
            {
                Exception packageEx = new Exception("执行OnPreLoad事件引发异常", ex);
                throw packageEx;
            }

            base.OnPreLoad(e);
        }

        protected override void Render(System.Web.UI.HtmlTextWriter writer)
        {
            base.Render(writer);

            // 写入脚本
            WriteScript();

            // 写入数据源
            WriteDatasource();
        }

        #region Private成员

        /// <summary>
        /// 结束当前请求
        /// </summary>
        private void EndResponse()
        {
            // 写入脚本
            WriteScript();

            // 写入数据源
            WriteDatasource();

            // 结束请求
            Response.End();
        }

        /// <summary>
        /// 向页面写入注册的脚本
        /// </summary>
        private void WriteScript()
        {
            if (_scripts.Count > 0)
            {
                StringBuilder appender = new StringBuilder();
                foreach (string key in _scripts.AllKeys)
                {
                    appender.AppendLine(_scripts[key]);
                }

                string scriptstring = appender.ToString();
                scriptstring = scriptstring.Replace(">,<", "><");
                Response.Write(scriptstring);
            }
        }

        /// <summary>
        /// 向页面写入已添加的数据源
        /// </summary>
        private void WriteDatasource()
        {
            if (_datasources.Count == 0)
            {
                return;
            }

            StringBuilder appender = new StringBuilder();
            if (DoPageLoad)
            {
                appender.Append("<script>var user_datasource = ");
            }

            appender.Append("{");

            foreach (string key in _datasources.AllKeys)
            {
                appender.Append(string.Format("'{0}':{1},", Utils.FormatString(key), _datasources[key]));
            }

            appender = appender.Remove(appender.Length - 1, 1);
            appender.Append("}");

            if (DoPageLoad)
            {
                appender.Append(";</script>");
            }

            Response.Write(appender.ToString());
        }

        #endregion
    }
}
