using System;
using System.IO;
using System.Windows.Forms;
using System.Collections.Generic;
using OBSWebsocketDotNet;
using OBSWebsocketDotNet.Types;
using System.Threading.Tasks;

namespace ConfigurationTool
{
	public partial class ConfigurationTool : Form
	{
		protected OBSWebsocket _obs;
        protected dynamic configOptions;

        public ConfigurationTool()
		{
			InitializeComponent();
			_obs = new OBSWebsocket();

            if (!File.Exists("configuration.json"))
			{
                File.Create("configuration.json");
			}

            string json = File.ReadAllText("configuration.json");
            configOptions = Newtonsoft.Json.JsonConvert.DeserializeObject(json);

            DisableTable(this);
            populateConnections();

            _obs.Connected += onConnect;
            _obs.Disconnected += onDisconnect;
        }

        // Populate the OBS and Rocket League connections from the configuration file
        private void populateConnections()
		{
            string obsHostname = Convert.ToString(configOptions["connections"]["OBSHostname"]);
            string[] obsHostnameSplit = obsHostname.Split(':');
            string obsAuth = Convert.ToString(configOptions["connections"]["OBSAuth"]);

            obs_ip.Text = obsHostnameSplit[0];
            obs_port.Text = obsHostnameSplit[1];
            obs_password.Text = obsAuth;

            string rlHostname = Convert.ToString(configOptions["connections"]["RocketLeagueHostname"]);
            string[] rlHostnameSplit = rlHostname.Split(':');

            rl_ip.Text = rlHostnameSplit[0];
            rl_port.Text = rlHostnameSplit[1];
        }

        // Disabling all controls in the table
        private void DisableTable(Control con)
		{
            DisableControls(con);

            EnableControls(obs_ip_label);
            EnableControls(obs_port_label);
            EnableControls(obs_password_label);
            EnableControls(obs_password_note_label);
            EnableControls(obs_label);
            EnableControls(obs_ip);
            EnableControls(obs_port);
            EnableControls(obs_colon);
            EnableControls(obs_password);
            EnableControls(obs_button);

            EnableControls(rl_ip_label);
            EnableControls(rl_port_label);
            EnableControls(rl_label);
            EnableControls(rl_ip);
            EnableControls(rl_colon);
            EnableControls(rl_port);
        }

        // Enabling all controls in the table
        private void EnableTable(Control con)
        {
            DisableControls(con);
            EnableControls(obs_button);

            EnableControls(rl_ip_label);
            EnableControls(rl_port_label);
            EnableControls(rl_label);
            EnableControls(rl_ip);
            EnableControls(rl_colon);
            EnableControls(rl_port);

            EnableControls(event_label);
            EnableControls(scene_label);
            EnableControls(delay_label);
            EnableControls(enable_label);

			EnableControls(initialized_label);
            EnableControls(initialized_comboBox);
            EnableControls(initialized_textBox);
            EnableControls(initialized_checkBox);

            EnableControls(goal_scored_label);
            EnableControls(goal_scored_scene_textBox);
            EnableControls(goal_scored_textBox);
            EnableControls(goal_scored_checkBox);

            EnableControls(replay_will_end_label);
            EnableControls(replay_will_end_comboBox);
            EnableControls(replay_will_end_textBox);
            EnableControls(replay_will_end_checkBox);

            EnableControls(replay_end_label);
            EnableControls(replay_end_comboBox);
            EnableControls(replay_end_textBox);
            EnableControls(replay_end_checkBox);

            EnableControls(match_ended_label);
            EnableControls(match_ended_scene_textBox);
            EnableControls(match_ended_textBox);
            EnableControls(match_ended_checkBox);

            EnableControls(podium_start_label);
            EnableControls(podium_start_comboBox);
            EnableControls(podium_start_textBox);
            EnableControls(podium_start_checkBox);

            EnableControls(match_destroyed_label);
            EnableControls(match_destroyed_comboBox);
            EnableControls(match_destroyed_textBox);
            EnableControls(match_destroyed_checkBox);

            EnableControls(note_label);
        }

        private void DisableControls(Control con)
        {
            foreach (Control c in con.Controls)
            {
                DisableControls(c);
            }
            con.Enabled = false;
        }

        private void EnableControls(Control con)
        {
            if (con != null)
            {
                con.Enabled = true;
                EnableControls(con.Parent);
            }
        }

        private void onConnect(object sender, EventArgs e)
        {
            BeginInvoke((MethodInvoker)(() => {
                obs_button.Text = "Disconnect";
                EnableTable(this);

                GetSceneListInfo sceneListInfo = _obs.GetSceneList();
                populateTable(sceneListInfo);
            }));
        }

        // Populating the table's data from the configuration file
        private void populateTable(GetSceneListInfo sceneListInfo)
		{
            List<SceneBasicInfo> scenes = sceneListInfo.Scenes;
            foreach (SceneBasicInfo scene in scenes)
            {
                initialized_comboBox.Items.Add(scene.Name);
                replay_will_end_comboBox.Items.Add(scene.Name);
                replay_end_comboBox.Items.Add(scene.Name);
                podium_start_comboBox.Items.Add(scene.Name);
                match_destroyed_comboBox.Items.Add(scene.Name);
            }

            // Populating scene comboboxes
            initialized_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["initialized"]));
            replay_will_end_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["replay_will_end"]));
            replay_end_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["replay_end"]));
            podium_start_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["podium_start"]));
            match_destroyed_comboBox.SelectedIndex = initialized_comboBox.FindStringExact(
                Convert.ToString(configOptions["scenes"]["match_destroyed"]));

            // Populating scene textboxes
            goal_scored_scene_textBox.Text = Convert.ToString(configOptions["scenes"]["goal_scored"]);
            match_ended_scene_textBox.Text = Convert.ToString(configOptions["scenes"]["match_ended"]);

            // Populating delay textboxes
            initialized_textBox.Text = Convert.ToString(configOptions["delays"]["initialized"]);
            goal_scored_textBox.Text = Convert.ToString(configOptions["delays"]["goal_scored"]);
            replay_will_end_textBox.Text = Convert.ToString(configOptions["delays"]["replay_will_end"]);
            replay_end_textBox.Text = Convert.ToString(configOptions["delays"]["replay_end"]);
            match_ended_textBox.Text = Convert.ToString(configOptions["delays"]["match_ended"]);
            podium_start_textBox.Text = Convert.ToString(configOptions["delays"]["podium_start"]);
            match_destroyed_textBox.Text = Convert.ToString(configOptions["delays"]["match_destroyed"]);

            // Populating enable checkboxes
            initialized_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["initialized"]);
            goal_scored_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["goal_scored"]);
            replay_will_end_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["replay_will_end"]);
            replay_end_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["replay_end"]);
            match_ended_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["match_ended"]);
            podium_start_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["podium_start"]);
            match_destroyed_checkBox.Checked = Convert.ToBoolean(configOptions["enable"]["match_destroyed"]);
        }

        private void cleanTable()
        {
			// Clean scene textboxes
			goal_scored_scene_textBox.Text = string.Empty;
			match_ended_scene_textBox.Text = string.Empty;

			// Clean comboboxes
			initialized_comboBox.Items.Clear();
			replay_will_end_comboBox.Items.Clear();
			replay_end_comboBox.Items.Clear();
			podium_start_comboBox.Items.Clear();
			match_destroyed_comboBox.Items.Clear();

            // Clean delay textboxes
            initialized_textBox.Text = string.Empty;
            goal_scored_textBox.Text = string.Empty;
            replay_will_end_textBox.Text = string.Empty;
            replay_end_textBox.Text = string.Empty;
            match_ended_textBox.Text = string.Empty;
            podium_start_textBox.Text = string.Empty;
            match_destroyed_textBox.Text = string.Empty;

            // Clean checkboxes
            initialized_checkBox.Checked = false;
            goal_scored_checkBox.Checked = false;
            replay_will_end_checkBox.Checked = false;
            replay_end_checkBox.Checked = false;
            match_ended_checkBox.Checked = false;
            podium_start_checkBox.Checked = false;
            match_destroyed_checkBox.Checked = false;
		}

        private void onDisconnect(object sender, OBSWebsocketDotNet.Communication.ObsDisconnectionInfo e)
		{
            BeginInvoke((MethodInvoker)(() => {
                cleanTable();

				DisableTable(this);
                obs_button.Text = "Connect to OBS";
            }));
        }

		private void obs_button_Click(object sender, EventArgs e)
		{
            if (!_obs.IsConnected)
            {
                try
                {
                    string obs_hostname = "ws://" + obs_ip.Text + ":" + obs_port.Text;
                    var task = Task.Run(() => _obs.ConnectAsync(obs_hostname, obs_password.Text));

                }
                catch (AuthFailureException)
                {
                    MessageBox.Show("Authentication failed.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    return;
                }
                catch (ErrorResponseException ex)
                {
                    MessageBox.Show("Connect failed : " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    return;
                }
            }
            else
            {
                _obs.Disconnect();
            }
        }

        // Whenever one of the scene's comboboxes or textboxes are changed, it updates the configuration
		private void scene_TextChanged(object sender, EventArgs e)
		{
            // Prevents clearing the textbox from modifying the file
            if (_obs.IsConnected)
            {
                Control control = (Control)sender;
                string eventName;

                // Removing the end of the string to get the event
                if (control.Name.Contains("comboBox"))
                {
                    eventName = control.Name.Replace("_comboBox", "");
                }
                else
                {
                    eventName = control.Name.Replace("_scene_textBox", "");
                }

                configOptions["scenes"][eventName] = control.Text;

                string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
                File.WriteAllText("configuration.json", output);
            }
        }

        // Whenever one of the delay's textboxes are changed, it updates the configuration
        private void delay_TextChanged(object sender, EventArgs e)
		{
			// Prevents clearing the textbox from modifying the file
			if (_obs.IsConnected)
            {
                TextBox control = (TextBox)sender;
                string eventName = control.Name.Replace("_textBox", "");

                if (control.Text != "")
                {
                    int delay = Convert.ToInt32(control.Text);
                    configOptions["delays"][eventName] = delay;

                    string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
                    File.WriteAllText("configuration.json", output);
                }
            }
        }

        // Whenever one of the enable's checkboxes are changed, it updates the configuration
        private void enable_CheckedChanged(object sender, EventArgs e)
        {
			// Prevents clearing the textbox from modifying the file
			if (_obs.IsConnected)
            {
                CheckBox control = (CheckBox)sender;
                string eventName = control.Name.Replace("_checkBox", "");

                bool enable = control.Checked;
                configOptions["enable"][eventName] = enable;

                string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
                File.WriteAllText("configuration.json", output);
            }
        }

        // Whenever one of the obs' textboxes are changed, it updates the configuration
        private void obs_TextChanged(object sender, EventArgs e)
		{
            Control control = (Control)sender;
            string eventName = control.Name;
            string newEntry;

            if (eventName == "obs_ip")
			{
                newEntry = control.Text + ":" + obs_port.Text;
                configOptions["connections"]["OBSHostname"] = newEntry;
            }
            else if (eventName == "obs_port")
			{
                newEntry = obs_ip.Text + ":" + control.Text;
                configOptions["connections"]["OBSHostname"] = newEntry;
            }
            else if (eventName == "obs_password")
            {
                newEntry = control.Text;
                configOptions["connections"]["OBSAuth"] = newEntry;
            }

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
            File.WriteAllText("configuration.json", output);
        }

        // Whenever one of the rl's textboxes are changed, it updates the configuration
        private void rl_TextChanged(object sender, EventArgs e)
        {
            Control control = (Control)sender;
            string eventName = control.Name;
            string newEntry;

            if (eventName == "rl_ip")
            {
                newEntry = control.Text + ":" + rl_port.Text;
                configOptions["connections"]["RocketLeagueHostname"] = newEntry;
            }
            else if (eventName == "rl_port")
            {
                newEntry = rl_ip.Text + ":" + control.Text;
                configOptions["connections"]["RocketLeagueHostname"] = newEntry;
            }

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(configOptions, Newtonsoft.Json.Formatting.Indented);
            File.WriteAllText("configuration.json", output);
        }
	}
}
