namespace ConfigurationTool
{
	partial class ConfigurationTool
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ConfigurationTool));
			this.obs_ip = new System.Windows.Forms.TextBox();
			this.obs_port = new System.Windows.Forms.TextBox();
			this.obs_colon = new System.Windows.Forms.Label();
			this.rl_colon = new System.Windows.Forms.Label();
			this.rl_port = new System.Windows.Forms.TextBox();
			this.rl_ip = new System.Windows.Forms.TextBox();
			this.obs_button = new System.Windows.Forms.Button();
			this.config_table = new System.Windows.Forms.TableLayoutPanel();
			this.replay_will_end_textBox = new System.Windows.Forms.TextBox();
			this.goal_scored_textBox = new System.Windows.Forms.TextBox();
			this.event_label = new System.Windows.Forms.Label();
			this.goal_scored_label = new System.Windows.Forms.Label();
			this.initialized_label = new System.Windows.Forms.Label();
			this.scene_label = new System.Windows.Forms.Label();
			this.delay_label = new System.Windows.Forms.Label();
			this.enable_label = new System.Windows.Forms.Label();
			this.initialized_comboBox = new System.Windows.Forms.ComboBox();
			this.replay_will_end_comboBox = new System.Windows.Forms.ComboBox();
			this.initialized_checkBox = new System.Windows.Forms.CheckBox();
			this.goal_scored_checkBox = new System.Windows.Forms.CheckBox();
			this.replay_will_end_checkBox = new System.Windows.Forms.CheckBox();
			this.initialized_textBox = new System.Windows.Forms.TextBox();
			this.match_destroyed_label = new System.Windows.Forms.Label();
			this.match_destroyed_comboBox = new System.Windows.Forms.ComboBox();
			this.match_destroyed_textBox = new System.Windows.Forms.TextBox();
			this.match_destroyed_checkBox = new System.Windows.Forms.CheckBox();
			this.podium_start_label = new System.Windows.Forms.Label();
			this.podium_start_comboBox = new System.Windows.Forms.ComboBox();
			this.podium_start_textBox = new System.Windows.Forms.TextBox();
			this.podium_start_checkBox = new System.Windows.Forms.CheckBox();
			this.match_ended_label = new System.Windows.Forms.Label();
			this.match_ended_textBox = new System.Windows.Forms.TextBox();
			this.match_ended_checkBox = new System.Windows.Forms.CheckBox();
			this.replay_will_end_label = new System.Windows.Forms.Label();
			this.replay_end_label = new System.Windows.Forms.Label();
			this.replay_end_comboBox = new System.Windows.Forms.ComboBox();
			this.replay_end_textBox = new System.Windows.Forms.TextBox();
			this.replay_end_checkBox = new System.Windows.Forms.CheckBox();
			this.goal_scored_scene_textBox = new System.Windows.Forms.TextBox();
			this.match_ended_scene_textBox = new System.Windows.Forms.TextBox();
			this.obs_ip_label = new System.Windows.Forms.Label();
			this.obs_port_label = new System.Windows.Forms.Label();
			this.obs_password = new System.Windows.Forms.TextBox();
			this.obs_password_label = new System.Windows.Forms.Label();
			this.obs_label = new System.Windows.Forms.Label();
			this.rl_label = new System.Windows.Forms.Label();
			this.rl_port_label = new System.Windows.Forms.Label();
			this.rl_ip_label = new System.Windows.Forms.Label();
			this.note_label = new System.Windows.Forms.Label();
			this.obs_password_note_label = new System.Windows.Forms.Label();
			this.config_table.SuspendLayout();
			this.SuspendLayout();
			// 
			// obs_ip
			// 
			this.obs_ip.Location = new System.Drawing.Point(99, 30);
			this.obs_ip.Name = "obs_ip";
			this.obs_ip.Size = new System.Drawing.Size(100, 20);
			this.obs_ip.TabIndex = 0;
			this.obs_ip.TextChanged += new System.EventHandler(this.obs_TextChanged);
			// 
			// obs_port
			// 
			this.obs_port.Location = new System.Drawing.Point(212, 30);
			this.obs_port.Name = "obs_port";
			this.obs_port.Size = new System.Drawing.Size(100, 20);
			this.obs_port.TabIndex = 1;
			this.obs_port.TextChanged += new System.EventHandler(this.obs_TextChanged);
			// 
			// obs_colon
			// 
			this.obs_colon.AutoSize = true;
			this.obs_colon.Font = new System.Drawing.Font("Calibri", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
			this.obs_colon.Location = new System.Drawing.Point(199, 29);
			this.obs_colon.Name = "obs_colon";
			this.obs_colon.Size = new System.Drawing.Size(13, 19);
			this.obs_colon.TabIndex = 2;
			this.obs_colon.Text = ":";
			// 
			// rl_colon
			// 
			this.rl_colon.AutoSize = true;
			this.rl_colon.Font = new System.Drawing.Font("Calibri", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
			this.rl_colon.Location = new System.Drawing.Point(199, 76);
			this.rl_colon.Name = "rl_colon";
			this.rl_colon.Size = new System.Drawing.Size(13, 19);
			this.rl_colon.TabIndex = 5;
			this.rl_colon.Text = ":";
			// 
			// rl_port
			// 
			this.rl_port.Location = new System.Drawing.Point(212, 77);
			this.rl_port.Name = "rl_port";
			this.rl_port.Size = new System.Drawing.Size(100, 20);
			this.rl_port.TabIndex = 4;
			this.rl_port.TextChanged += new System.EventHandler(this.rl_TextChanged);
			// 
			// rl_ip
			// 
			this.rl_ip.Location = new System.Drawing.Point(99, 77);
			this.rl_ip.Name = "rl_ip";
			this.rl_ip.Size = new System.Drawing.Size(100, 20);
			this.rl_ip.TabIndex = 3;
			this.rl_ip.TextChanged += new System.EventHandler(this.rl_TextChanged);
			// 
			// obs_button
			// 
			this.obs_button.Location = new System.Drawing.Point(429, 28);
			this.obs_button.Name = "obs_button";
			this.obs_button.Size = new System.Drawing.Size(93, 23);
			this.obs_button.TabIndex = 6;
			this.obs_button.Text = "Connect to OBS";
			this.obs_button.UseVisualStyleBackColor = true;
			this.obs_button.Click += new System.EventHandler(this.obs_button_Click);
			// 
			// config_table
			// 
			this.config_table.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.config_table.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
			this.config_table.CellBorderStyle = System.Windows.Forms.TableLayoutPanelCellBorderStyle.Outset;
			this.config_table.ColumnCount = 4;
			this.config_table.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 25F));
			this.config_table.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 30F));
			this.config_table.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 30F));
			this.config_table.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 15F));
			this.config_table.Controls.Add(this.replay_will_end_textBox, 2, 3);
			this.config_table.Controls.Add(this.goal_scored_textBox, 2, 2);
			this.config_table.Controls.Add(this.event_label, 0, 0);
			this.config_table.Controls.Add(this.goal_scored_label, 0, 2);
			this.config_table.Controls.Add(this.initialized_label, 0, 1);
			this.config_table.Controls.Add(this.scene_label, 1, 0);
			this.config_table.Controls.Add(this.delay_label, 2, 0);
			this.config_table.Controls.Add(this.enable_label, 3, 0);
			this.config_table.Controls.Add(this.initialized_comboBox, 1, 1);
			this.config_table.Controls.Add(this.replay_will_end_comboBox, 1, 3);
			this.config_table.Controls.Add(this.initialized_checkBox, 3, 1);
			this.config_table.Controls.Add(this.goal_scored_checkBox, 3, 2);
			this.config_table.Controls.Add(this.replay_will_end_checkBox, 3, 3);
			this.config_table.Controls.Add(this.initialized_textBox, 2, 1);
			this.config_table.Controls.Add(this.match_destroyed_label, 0, 7);
			this.config_table.Controls.Add(this.match_destroyed_comboBox, 1, 7);
			this.config_table.Controls.Add(this.match_destroyed_textBox, 2, 7);
			this.config_table.Controls.Add(this.match_destroyed_checkBox, 3, 7);
			this.config_table.Controls.Add(this.podium_start_label, 0, 6);
			this.config_table.Controls.Add(this.podium_start_comboBox, 1, 6);
			this.config_table.Controls.Add(this.podium_start_textBox, 2, 6);
			this.config_table.Controls.Add(this.podium_start_checkBox, 3, 6);
			this.config_table.Controls.Add(this.match_ended_label, 0, 5);
			this.config_table.Controls.Add(this.match_ended_textBox, 2, 5);
			this.config_table.Controls.Add(this.match_ended_checkBox, 3, 5);
			this.config_table.Controls.Add(this.replay_will_end_label, 0, 3);
			this.config_table.Controls.Add(this.replay_end_label, 0, 4);
			this.config_table.Controls.Add(this.replay_end_comboBox, 1, 4);
			this.config_table.Controls.Add(this.replay_end_textBox, 2, 4);
			this.config_table.Controls.Add(this.replay_end_checkBox, 3, 4);
			this.config_table.Controls.Add(this.goal_scored_scene_textBox, 1, 2);
			this.config_table.Controls.Add(this.match_ended_scene_textBox, 1, 5);
			this.config_table.Location = new System.Drawing.Point(12, 119);
			this.config_table.Name = "config_table";
			this.config_table.RowCount = 8;
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 9F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 13F));
			this.config_table.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 20F));
			this.config_table.Size = new System.Drawing.Size(510, 376);
			this.config_table.TabIndex = 7;
			// 
			// replay_will_end_textBox
			// 
			this.replay_will_end_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_will_end_textBox.Location = new System.Drawing.Point(306, 145);
			this.replay_will_end_textBox.Name = "replay_will_end_textBox";
			this.replay_will_end_textBox.Size = new System.Drawing.Size(100, 20);
			this.replay_will_end_textBox.TabIndex = 24;
			this.replay_will_end_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// goal_scored_textBox
			// 
			this.goal_scored_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.goal_scored_textBox.Location = new System.Drawing.Point(306, 97);
			this.goal_scored_textBox.Name = "goal_scored_textBox";
			this.goal_scored_textBox.Size = new System.Drawing.Size(100, 20);
			this.goal_scored_textBox.TabIndex = 23;
			this.goal_scored_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// event_label
			// 
			this.event_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.event_label.AutoSize = true;
			this.event_label.Location = new System.Drawing.Point(47, 11);
			this.event_label.Name = "event_label";
			this.event_label.Size = new System.Drawing.Size(35, 13);
			this.event_label.TabIndex = 0;
			this.event_label.Text = "Event";
			// 
			// goal_scored_label
			// 
			this.goal_scored_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.goal_scored_label.AutoSize = true;
			this.goal_scored_label.Location = new System.Drawing.Point(31, 100);
			this.goal_scored_label.Name = "goal_scored_label";
			this.goal_scored_label.Size = new System.Drawing.Size(66, 13);
			this.goal_scored_label.TabIndex = 6;
			this.goal_scored_label.Text = "Goal Scored";
			// 
			// initialized_label
			// 
			this.initialized_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.initialized_label.AutoSize = true;
			this.initialized_label.Location = new System.Drawing.Point(34, 52);
			this.initialized_label.Name = "initialized_label";
			this.initialized_label.Size = new System.Drawing.Size(60, 13);
			this.initialized_label.TabIndex = 5;
			this.initialized_label.Text = "Game Start";
			// 
			// scene_label
			// 
			this.scene_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.scene_label.AutoSize = true;
			this.scene_label.Location = new System.Drawing.Point(185, 11);
			this.scene_label.Name = "scene_label";
			this.scene_label.Size = new System.Drawing.Size(38, 13);
			this.scene_label.TabIndex = 3;
			this.scene_label.Text = "Scene";
			// 
			// delay_label
			// 
			this.delay_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.delay_label.AutoSize = true;
			this.delay_label.Location = new System.Drawing.Point(328, 11);
			this.delay_label.Name = "delay_label";
			this.delay_label.Size = new System.Drawing.Size(56, 13);
			this.delay_label.TabIndex = 7;
			this.delay_label.Text = "Delay (ms)";
			// 
			// enable_label
			// 
			this.enable_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.enable_label.AutoSize = true;
			this.enable_label.Location = new System.Drawing.Point(450, 11);
			this.enable_label.Name = "enable_label";
			this.enable_label.Size = new System.Drawing.Size(40, 13);
			this.enable_label.TabIndex = 8;
			this.enable_label.Text = "Enable";
			// 
			// initialized_comboBox
			// 
			this.initialized_comboBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.initialized_comboBox.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.initialized_comboBox.FormattingEnabled = true;
			this.initialized_comboBox.Location = new System.Drawing.Point(143, 48);
			this.initialized_comboBox.Name = "initialized_comboBox";
			this.initialized_comboBox.Size = new System.Drawing.Size(121, 21);
			this.initialized_comboBox.TabIndex = 10;
			this.initialized_comboBox.SelectedIndexChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// replay_will_end_comboBox
			// 
			this.replay_will_end_comboBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_will_end_comboBox.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.replay_will_end_comboBox.FormattingEnabled = true;
			this.replay_will_end_comboBox.Location = new System.Drawing.Point(143, 144);
			this.replay_will_end_comboBox.Name = "replay_will_end_comboBox";
			this.replay_will_end_comboBox.Size = new System.Drawing.Size(121, 21);
			this.replay_will_end_comboBox.TabIndex = 12;
			this.replay_will_end_comboBox.SelectedIndexChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// initialized_checkBox
			// 
			this.initialized_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.initialized_checkBox.AutoSize = true;
			this.initialized_checkBox.Location = new System.Drawing.Point(463, 52);
			this.initialized_checkBox.Name = "initialized_checkBox";
			this.initialized_checkBox.Size = new System.Drawing.Size(15, 14);
			this.initialized_checkBox.TabIndex = 16;
			this.initialized_checkBox.UseVisualStyleBackColor = true;
			this.initialized_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// goal_scored_checkBox
			// 
			this.goal_scored_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.goal_scored_checkBox.AutoSize = true;
			this.goal_scored_checkBox.Location = new System.Drawing.Point(463, 100);
			this.goal_scored_checkBox.Name = "goal_scored_checkBox";
			this.goal_scored_checkBox.Size = new System.Drawing.Size(15, 14);
			this.goal_scored_checkBox.TabIndex = 17;
			this.goal_scored_checkBox.UseVisualStyleBackColor = true;
			this.goal_scored_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// replay_will_end_checkBox
			// 
			this.replay_will_end_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_will_end_checkBox.AutoSize = true;
			this.replay_will_end_checkBox.Location = new System.Drawing.Point(463, 148);
			this.replay_will_end_checkBox.Name = "replay_will_end_checkBox";
			this.replay_will_end_checkBox.Size = new System.Drawing.Size(15, 14);
			this.replay_will_end_checkBox.TabIndex = 18;
			this.replay_will_end_checkBox.UseVisualStyleBackColor = true;
			this.replay_will_end_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// initialized_textBox
			// 
			this.initialized_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.initialized_textBox.Location = new System.Drawing.Point(306, 49);
			this.initialized_textBox.Name = "initialized_textBox";
			this.initialized_textBox.Size = new System.Drawing.Size(100, 20);
			this.initialized_textBox.TabIndex = 22;
			this.initialized_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// match_destroyed_label
			// 
			this.match_destroyed_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_destroyed_label.AutoSize = true;
			this.match_destroyed_label.Location = new System.Drawing.Point(20, 342);
			this.match_destroyed_label.Name = "match_destroyed_label";
			this.match_destroyed_label.Size = new System.Drawing.Size(88, 13);
			this.match_destroyed_label.TabIndex = 9;
			this.match_destroyed_label.Text = "Match Destroyed";
			// 
			// match_destroyed_comboBox
			// 
			this.match_destroyed_comboBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_destroyed_comboBox.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.match_destroyed_comboBox.FormattingEnabled = true;
			this.match_destroyed_comboBox.Location = new System.Drawing.Point(143, 338);
			this.match_destroyed_comboBox.Name = "match_destroyed_comboBox";
			this.match_destroyed_comboBox.Size = new System.Drawing.Size(121, 21);
			this.match_destroyed_comboBox.TabIndex = 15;
			this.match_destroyed_comboBox.SelectedIndexChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// match_destroyed_textBox
			// 
			this.match_destroyed_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_destroyed_textBox.Location = new System.Drawing.Point(306, 339);
			this.match_destroyed_textBox.Name = "match_destroyed_textBox";
			this.match_destroyed_textBox.Size = new System.Drawing.Size(100, 20);
			this.match_destroyed_textBox.TabIndex = 27;
			this.match_destroyed_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// match_destroyed_checkBox
			// 
			this.match_destroyed_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_destroyed_checkBox.AutoSize = true;
			this.match_destroyed_checkBox.Location = new System.Drawing.Point(463, 342);
			this.match_destroyed_checkBox.Name = "match_destroyed_checkBox";
			this.match_destroyed_checkBox.Size = new System.Drawing.Size(15, 14);
			this.match_destroyed_checkBox.TabIndex = 21;
			this.match_destroyed_checkBox.UseVisualStyleBackColor = true;
			this.match_destroyed_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// podium_start_label
			// 
			this.podium_start_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.podium_start_label.AutoSize = true;
			this.podium_start_label.Location = new System.Drawing.Point(31, 292);
			this.podium_start_label.Name = "podium_start_label";
			this.podium_start_label.Size = new System.Drawing.Size(67, 13);
			this.podium_start_label.TabIndex = 4;
			this.podium_start_label.Text = "Podium Start";
			// 
			// podium_start_comboBox
			// 
			this.podium_start_comboBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.podium_start_comboBox.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.podium_start_comboBox.FormattingEnabled = true;
			this.podium_start_comboBox.Location = new System.Drawing.Point(143, 288);
			this.podium_start_comboBox.Name = "podium_start_comboBox";
			this.podium_start_comboBox.Size = new System.Drawing.Size(121, 21);
			this.podium_start_comboBox.TabIndex = 14;
			this.podium_start_comboBox.SelectedIndexChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// podium_start_textBox
			// 
			this.podium_start_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.podium_start_textBox.Location = new System.Drawing.Point(306, 289);
			this.podium_start_textBox.Name = "podium_start_textBox";
			this.podium_start_textBox.Size = new System.Drawing.Size(100, 20);
			this.podium_start_textBox.TabIndex = 26;
			this.podium_start_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// podium_start_checkBox
			// 
			this.podium_start_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.podium_start_checkBox.AutoSize = true;
			this.podium_start_checkBox.Location = new System.Drawing.Point(463, 292);
			this.podium_start_checkBox.Name = "podium_start_checkBox";
			this.podium_start_checkBox.Size = new System.Drawing.Size(15, 14);
			this.podium_start_checkBox.TabIndex = 20;
			this.podium_start_checkBox.UseVisualStyleBackColor = true;
			this.podium_start_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// match_ended_label
			// 
			this.match_ended_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_ended_label.AutoSize = true;
			this.match_ended_label.Location = new System.Drawing.Point(29, 244);
			this.match_ended_label.Name = "match_ended_label";
			this.match_ended_label.Size = new System.Drawing.Size(71, 13);
			this.match_ended_label.TabIndex = 1;
			this.match_ended_label.Text = "Match Ended";
			// 
			// match_ended_textBox
			// 
			this.match_ended_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_ended_textBox.Location = new System.Drawing.Point(306, 241);
			this.match_ended_textBox.Name = "match_ended_textBox";
			this.match_ended_textBox.Size = new System.Drawing.Size(100, 20);
			this.match_ended_textBox.TabIndex = 25;
			this.match_ended_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// match_ended_checkBox
			// 
			this.match_ended_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_ended_checkBox.AutoSize = true;
			this.match_ended_checkBox.Location = new System.Drawing.Point(463, 244);
			this.match_ended_checkBox.Name = "match_ended_checkBox";
			this.match_ended_checkBox.Size = new System.Drawing.Size(15, 14);
			this.match_ended_checkBox.TabIndex = 19;
			this.match_ended_checkBox.UseVisualStyleBackColor = true;
			this.match_ended_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// replay_will_end_label
			// 
			this.replay_will_end_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_will_end_label.AutoSize = true;
			this.replay_will_end_label.Location = new System.Drawing.Point(13, 148);
			this.replay_will_end_label.Name = "replay_will_end_label";
			this.replay_will_end_label.Size = new System.Drawing.Size(103, 13);
			this.replay_will_end_label.TabIndex = 2;
			this.replay_will_end_label.Text = "Replay Almost Done";
			// 
			// replay_end_label
			// 
			this.replay_end_label.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_end_label.AutoSize = true;
			this.replay_end_label.Location = new System.Drawing.Point(33, 196);
			this.replay_end_label.Name = "replay_end_label";
			this.replay_end_label.Size = new System.Drawing.Size(62, 13);
			this.replay_end_label.TabIndex = 28;
			this.replay_end_label.Text = "Replay End";
			// 
			// replay_end_comboBox
			// 
			this.replay_end_comboBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_end_comboBox.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
			this.replay_end_comboBox.FormattingEnabled = true;
			this.replay_end_comboBox.Location = new System.Drawing.Point(143, 192);
			this.replay_end_comboBox.Name = "replay_end_comboBox";
			this.replay_end_comboBox.Size = new System.Drawing.Size(121, 21);
			this.replay_end_comboBox.TabIndex = 29;
			this.replay_end_comboBox.SelectedIndexChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// replay_end_textBox
			// 
			this.replay_end_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_end_textBox.Location = new System.Drawing.Point(306, 193);
			this.replay_end_textBox.Name = "replay_end_textBox";
			this.replay_end_textBox.Size = new System.Drawing.Size(100, 20);
			this.replay_end_textBox.TabIndex = 30;
			this.replay_end_textBox.TextChanged += new System.EventHandler(this.delay_TextChanged);
			// 
			// replay_end_checkBox
			// 
			this.replay_end_checkBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.replay_end_checkBox.AutoSize = true;
			this.replay_end_checkBox.Location = new System.Drawing.Point(463, 196);
			this.replay_end_checkBox.Name = "replay_end_checkBox";
			this.replay_end_checkBox.Size = new System.Drawing.Size(15, 14);
			this.replay_end_checkBox.TabIndex = 31;
			this.replay_end_checkBox.UseVisualStyleBackColor = true;
			this.replay_end_checkBox.CheckedChanged += new System.EventHandler(this.enable_CheckedChanged);
			// 
			// goal_scored_scene_textBox
			// 
			this.goal_scored_scene_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.goal_scored_scene_textBox.Location = new System.Drawing.Point(143, 97);
			this.goal_scored_scene_textBox.Name = "goal_scored_scene_textBox";
			this.goal_scored_scene_textBox.Size = new System.Drawing.Size(121, 20);
			this.goal_scored_scene_textBox.TabIndex = 32;
			this.goal_scored_scene_textBox.TextChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// match_ended_scene_textBox
			// 
			this.match_ended_scene_textBox.Anchor = System.Windows.Forms.AnchorStyles.None;
			this.match_ended_scene_textBox.Location = new System.Drawing.Point(143, 241);
			this.match_ended_scene_textBox.Name = "match_ended_scene_textBox";
			this.match_ended_scene_textBox.Size = new System.Drawing.Size(121, 20);
			this.match_ended_scene_textBox.TabIndex = 33;
			this.match_ended_scene_textBox.TextChanged += new System.EventHandler(this.scene_InputChanged);
			// 
			// obs_ip_label
			// 
			this.obs_ip_label.AutoSize = true;
			this.obs_ip_label.Location = new System.Drawing.Point(105, 14);
			this.obs_ip_label.Name = "obs_ip_label";
			this.obs_ip_label.Size = new System.Drawing.Size(58, 13);
			this.obs_ip_label.TabIndex = 8;
			this.obs_ip_label.Text = "IP Address";
			// 
			// obs_port_label
			// 
			this.obs_port_label.AutoSize = true;
			this.obs_port_label.Location = new System.Drawing.Point(218, 14);
			this.obs_port_label.Name = "obs_port_label";
			this.obs_port_label.Size = new System.Drawing.Size(26, 13);
			this.obs_port_label.TabIndex = 9;
			this.obs_port_label.Text = "Port";
			// 
			// obs_password
			// 
			this.obs_password.Location = new System.Drawing.Point(318, 30);
			this.obs_password.Name = "obs_password";
			this.obs_password.PasswordChar = '*';
			this.obs_password.Size = new System.Drawing.Size(100, 20);
			this.obs_password.TabIndex = 10;
			this.obs_password.TextChanged += new System.EventHandler(this.obs_TextChanged);
			// 
			// obs_password_label
			// 
			this.obs_password_label.AutoSize = true;
			this.obs_password_label.Location = new System.Drawing.Point(324, 14);
			this.obs_password_label.Name = "obs_password_label";
			this.obs_password_label.Size = new System.Drawing.Size(53, 13);
			this.obs_password_label.TabIndex = 11;
			this.obs_password_label.Text = "Password";
			// 
			// obs_label
			// 
			this.obs_label.AutoSize = true;
			this.obs_label.Location = new System.Drawing.Point(64, 33);
			this.obs_label.Name = "obs_label";
			this.obs_label.Size = new System.Drawing.Size(29, 13);
			this.obs_label.TabIndex = 12;
			this.obs_label.Text = "OBS";
			// 
			// rl_label
			// 
			this.rl_label.AutoSize = true;
			this.rl_label.Location = new System.Drawing.Point(12, 80);
			this.rl_label.Name = "rl_label";
			this.rl_label.Size = new System.Drawing.Size(81, 13);
			this.rl_label.TabIndex = 13;
			this.rl_label.Text = "Rocket League";
			// 
			// rl_port_label
			// 
			this.rl_port_label.AutoSize = true;
			this.rl_port_label.Location = new System.Drawing.Point(218, 61);
			this.rl_port_label.Name = "rl_port_label";
			this.rl_port_label.Size = new System.Drawing.Size(26, 13);
			this.rl_port_label.TabIndex = 15;
			this.rl_port_label.Text = "Port";
			// 
			// rl_ip_label
			// 
			this.rl_ip_label.AutoSize = true;
			this.rl_ip_label.Location = new System.Drawing.Point(105, 61);
			this.rl_ip_label.Name = "rl_ip_label";
			this.rl_ip_label.Size = new System.Drawing.Size(58, 13);
			this.rl_ip_label.TabIndex = 14;
			this.rl_ip_label.Text = "IP Address";
			// 
			// note_label
			// 
			this.note_label.AutoSize = true;
			this.note_label.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
			this.note_label.Location = new System.Drawing.Point(30, 512);
			this.note_label.Name = "note_label";
			this.note_label.Size = new System.Drawing.Size(472, 48);
			this.note_label.TabIndex = 16;
			this.note_label.Text = "Note: You can use {teamName} for team specific scenes on events \r\nGoal Scored and" +
    " Match Ended only\r\n\r\n";
			// 
			// obs_password_note_label
			// 
			this.obs_password_note_label.AutoSize = true;
			this.obs_password_note_label.Location = new System.Drawing.Point(324, 53);
			this.obs_password_note_label.Name = "obs_password_note_label";
			this.obs_password_note_label.Size = new System.Drawing.Size(191, 26);
			this.obs_password_note_label.TabIndex = 17;
			this.obs_password_note_label.Text = "Note: Do NOT use sensitive password!\r\nPassword stored in plaintext.\r\n";
			// 
			// ConfigurationTool
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(534, 560);
			this.Controls.Add(this.obs_password_note_label);
			this.Controls.Add(this.note_label);
			this.Controls.Add(this.rl_port_label);
			this.Controls.Add(this.rl_ip_label);
			this.Controls.Add(this.rl_label);
			this.Controls.Add(this.obs_label);
			this.Controls.Add(this.obs_password_label);
			this.Controls.Add(this.obs_password);
			this.Controls.Add(this.obs_port_label);
			this.Controls.Add(this.obs_ip_label);
			this.Controls.Add(this.config_table);
			this.Controls.Add(this.obs_button);
			this.Controls.Add(this.rl_colon);
			this.Controls.Add(this.rl_port);
			this.Controls.Add(this.rl_ip);
			this.Controls.Add(this.obs_colon);
			this.Controls.Add(this.obs_port);
			this.Controls.Add(this.obs_ip);
			this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
			this.Name = "ConfigurationTool";
			this.Text = "Configuration Tool";
			this.config_table.ResumeLayout(false);
			this.config_table.PerformLayout();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.TextBox obs_ip;
		private System.Windows.Forms.TextBox obs_port;
		private System.Windows.Forms.Label obs_colon;
		private System.Windows.Forms.Label rl_colon;
		private System.Windows.Forms.TextBox rl_port;
		private System.Windows.Forms.TextBox rl_ip;
		private System.Windows.Forms.Button obs_button;
		private System.Windows.Forms.TableLayoutPanel config_table;
		private System.Windows.Forms.Label obs_ip_label;
		private System.Windows.Forms.Label obs_port_label;
		private System.Windows.Forms.TextBox obs_password;
		private System.Windows.Forms.Label obs_password_label;
		private System.Windows.Forms.Label obs_label;
		private System.Windows.Forms.Label rl_label;
		private System.Windows.Forms.Label event_label;
		private System.Windows.Forms.Label match_destroyed_label;
		private System.Windows.Forms.Label podium_start_label;
		private System.Windows.Forms.Label match_ended_label;
		private System.Windows.Forms.Label replay_will_end_label;
		private System.Windows.Forms.Label goal_scored_label;
		private System.Windows.Forms.Label initialized_label;
		private System.Windows.Forms.Label scene_label;
		private System.Windows.Forms.Label delay_label;
		private System.Windows.Forms.Label enable_label;
		private System.Windows.Forms.ComboBox initialized_comboBox;
		private System.Windows.Forms.ComboBox replay_will_end_comboBox;
		private System.Windows.Forms.ComboBox podium_start_comboBox;
		private System.Windows.Forms.ComboBox match_destroyed_comboBox;
		private System.Windows.Forms.CheckBox initialized_checkBox;
		private System.Windows.Forms.CheckBox goal_scored_checkBox;
		private System.Windows.Forms.CheckBox replay_will_end_checkBox;
		private System.Windows.Forms.CheckBox match_ended_checkBox;
		private System.Windows.Forms.CheckBox podium_start_checkBox;
		private System.Windows.Forms.CheckBox match_destroyed_checkBox;
		private System.Windows.Forms.TextBox match_destroyed_textBox;
		private System.Windows.Forms.TextBox podium_start_textBox;
		private System.Windows.Forms.TextBox match_ended_textBox;
		private System.Windows.Forms.TextBox replay_will_end_textBox;
		private System.Windows.Forms.TextBox goal_scored_textBox;
		private System.Windows.Forms.TextBox initialized_textBox;
		private System.Windows.Forms.Label rl_port_label;
		private System.Windows.Forms.Label rl_ip_label;
		private System.Windows.Forms.Label note_label;
		private System.Windows.Forms.Label replay_end_label;
		private System.Windows.Forms.ComboBox replay_end_comboBox;
		private System.Windows.Forms.TextBox replay_end_textBox;
		private System.Windows.Forms.CheckBox replay_end_checkBox;
		private System.Windows.Forms.TextBox goal_scored_scene_textBox;
		private System.Windows.Forms.TextBox match_ended_scene_textBox;
		private System.Windows.Forms.Label obs_password_note_label;
	}
}

