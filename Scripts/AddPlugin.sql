USE [Bucky]
GO

CREATE TABLE #variables
    (
    PluginId uniqueidentifier,
    )
GO


DECLARE @PluginId uniqueidentifier
SET @PluginId = NEWID()

DECLARE @PluginName nvarchar(MAX)
SET @PluginName = 'Alarm'

DECLARE @PluginDescription nvarchar(MAX)
SET @PluginDescription = 'Set alarms using your Assistant'

DECLARE @PluginVersion nvarchar(MAX)
SET @PluginVersion = '1.0.0'

INSERT INTO [dbo].[Plugin]
           ([Id]
           ,[Name]
           ,[Description]
           ,[Version])
     VALUES
           (@PluginId
           ,@PluginName
           ,@PluginDescription
           ,@PluginVersion)
Select @PluginId

Insert into #variables Select @PluginId
GO

select * from #variables
DECLARE @PluginId uniqueidentifier
SET @PluginId = (Select top 1 * from #variables)

DECLARE @PluginNotifId uniqueidentifier
SET @PluginNotifId = NEWID()

DECLARE @PluginNotifActionType int
SET @PluginNotifActionType = 1 --Notification

DECLARE @PluginNotifMessage nvarchar(max)
SET @PluginNotifMessage = '!!!Alarm!!!'

INSERT INTO [dbo].[PluginNotifications]
           ([Id]
           ,[ActionType]
           ,[Message]
           ,[PluginId])
     VALUES
           (@PluginNotifId
           ,@PluginNotifActionType
           ,@PluginNotifMessage
           ,@PluginId)
GO

DROP table #variables
GO