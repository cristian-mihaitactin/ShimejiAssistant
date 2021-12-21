USE [Bucky]
GO
DECLARE @ProfileID as uniqueidentifier
Set @ProfileID = '8919E40E-D588-42F2-A0A8-4AFB9AD1589B'

DECLARE @ProfileName as nvarchar
Set @ProfileName = 'Bucky'

Declare @ProfileDescription as nvarchar
Set @ProfileDescription = 'Default Profile'

insert into [BuckyProfile]
 (Id, [Name], [Description])
 values (@ProfileID,
			@ProfileName,
			@ProfileDescription)

GO
USE [Bucky]
GO

DECLARE @ProfileID as uniqueidentifier
Set @ProfileID = '8919E40E-D588-42F2-A0A8-4AFB9AD1589B'

DECLARE @ProfileName as nvarchar
Set @ProfileName = 'Bucky'

Declare @ProfileDescription as nvarchar
Set @ProfileDescription = 'Default Profile'

insert into [BuckyProfile]
 (Id, [Name], [Description])
 values (@ProfileID,
			@ProfileName,
			@ProfileDescription)

GO

DECLARE @ProfileID as uniqueidentifier
Set @ProfileID = '8919E40E-D588-42F2-A0A8-4AFB9AD1589B'

INSERT INTO [dbo].[BuckyBehaviour]
           ([Id]
           ,[Name]
           ,[Description]
           ,[ActionType]
           ,[ImageBlobPath]
           ,[BuckyProfileId])
     VALUES
           ('8F950A48-7311-46DD-BEE3-ABD605766941'
           ,'Standby'
           ,'Bucky standing by'
           ,'0'
           ,'standby.png'
           ,@ProfileID)

INSERT INTO [dbo].[BuckyBehaviour]
           ([Id]
           ,[Name]
           ,[Description]
           ,[ActionType]
           ,[ImageBlobPath]
           ,[BuckyProfileId])
     VALUES
           ('95DEEF91-EEA9-47C8-99EE-50E881662CDF'
           ,'Notification'
           ,'Bucky has a notification'
           ,'1'
           ,'notification.png'
           ,@ProfileID)

INSERT INTO [dbo].[BuckyBehaviour]
           ([Id]
           ,[Name]
           ,[Description]
           ,[ActionType]
           ,[ImageBlobPath]
           ,[BuckyProfileId])
     VALUES
           ('6D816168-1717-4835-9D7D-B5D19A71613B'
           ,'Dragged'
           ,'Bucky beeing dragged around'
           ,'2'
           ,'dragged.png'
           ,@ProfileID)

INSERT INTO [dbo].[BuckyBehaviour]
           ([Id]
           ,[Name]
           ,[Description]
           ,[ActionType]
           ,[ImageBlobPath]
           ,[BuckyProfileId])
     VALUES
           ('67F106C0-D1D5-4901-947F-310BC4D4E1E9'
           ,'Attention'
           ,'Bucky is trying to get your attention'
           ,'4'
           ,'attention.png'
           ,@ProfileID)

INSERT INTO [dbo].[BuckyBehaviour]
           ([Id]
           ,[Name]
           ,[Description]
           ,[ActionType]
           ,[ImageBlobPath]
           ,[BuckyProfileId])
     VALUES
           ('8290E611-72D7-4BDE-8487-7C80EB04AD97'
           ,'Bow'
           ,'Bucky is bowing'
           ,'8'
           ,'bow.png'
           ,@ProfileID)

GO


