BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [agent_code] VARCHAR(20) NOT NULL,
    [name] VARCHAR(100) NOT NULL,
    [email] VARCHAR(100) NOT NULL,
    [password_hash] VARCHAR(255) NOT NULL,
    [phone_number] VARCHAR(20),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [users_created_at_df] DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [users_updated_at_df] DEFAULT GETDATE(),
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_agent_code_key] UNIQUE NONCLUSTERED ([agent_code])
);

-- CreateTable
CREATE TABLE [dbo].[pickup_points] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [pickup_point_code] VARCHAR(50),
    [email] VARCHAR(100),
    [name] VARCHAR(100) NOT NULL,
    [phone_number] VARCHAR(20) NOT NULL,
    [address] TEXT NOT NULL,
    [city] VARCHAR(100) NOT NULL,
    [postal_code] VARCHAR(10),
    [district_id] VARCHAR(50),
    [latitude] DECIMAL(10,7),
    [longitude] DECIMAL(10,7),
    [is_default] TINYINT NOT NULL CONSTRAINT [pickup_points_is_default_df] DEFAULT 0,
    [is_deleted] TINYINT NOT NULL CONSTRAINT [pickup_points_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [pickup_points_created_at_df] DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [pickup_points_updated_at_df] DEFAULT GETDATE(),
    CONSTRAINT [pickup_points_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[shipments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [pickup_point_code] VARCHAR(50) NOT NULL,
    [pickup_point_id] INT NOT NULL,
    [shipment_address_id] INT NOT NULL,
    [service_code] VARCHAR(50) NOT NULL,
    [awb] VARCHAR(50),
    [reff_client_id] VARCHAR(100) NOT NULL,
    [reff_autokirim_id] VARCHAR(100),
    [reff_courier_id] VARCHAR(100),
    [origin_id] INT,
    [destination_id] INT,
    [weight] DECIMAL(10,2),
    [qty] INT NOT NULL CONSTRAINT [shipments_qty_df] DEFAULT 1,
    [length] DECIMAL(10,2),
    [width] DECIMAL(10,2),
    [height] DECIMAL(10,2),
    [description] VARCHAR(255),
    [remarks] VARCHAR(255),
    [is_cod] TINYINT NOT NULL CONSTRAINT [shipments_is_cod_df] DEFAULT 0,
    [fee_cod] INT NOT NULL CONSTRAINT [shipments_fee_cod_df] DEFAULT 0,
    [item_price] INT NOT NULL CONSTRAINT [shipments_item_price_df] DEFAULT 0,
    [is_sender_pp] TINYINT NOT NULL CONSTRAINT [shipments_is_sender_pp_df] DEFAULT 0,
    [is_insurance] TINYINT NOT NULL CONSTRAINT [shipments_is_insurance_df] DEFAULT 0,
    [fee_insurance] INT NOT NULL CONSTRAINT [shipments_fee_insurance_df] DEFAULT 0,
    [fee_total] INT NOT NULL CONSTRAINT [shipments_fee_total_df] DEFAULT 0,
    [fee_courier] INT NOT NULL CONSTRAINT [shipments_fee_courier_df] DEFAULT 0,
    [pickup_name] VARCHAR(100) NOT NULL,
    [pickup_phone] VARCHAR(20),
    [pickup_address] TEXT NOT NULL,
    [pickup_city] VARCHAR(100),
    [pickup_postal_code] VARCHAR(10),
    [destination_name] VARCHAR(100) NOT NULL,
    [destination_phone] VARCHAR(20),
    [destination_address] TEXT NOT NULL,
    [destination_city] VARCHAR(100),
    [destination_postal_code] VARCHAR(10),
    [status] TINYINT NOT NULL CONSTRAINT [shipments_status_df] DEFAULT 0,
    [created_at_utc] DATETIME2 NOT NULL CONSTRAINT [shipments_created_at_utc_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at_utc] DATETIME2 NOT NULL CONSTRAINT [shipments_updated_at_utc_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [shipments_created_at_df] DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [shipments_updated_at_df] DEFAULT GETDATE(),
    CONSTRAINT [shipments_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [shipments_reff_client_id_key] UNIQUE NONCLUSTERED ([reff_client_id])
);

-- CreateTable
CREATE TABLE [dbo].[shipment_addresses] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [name] VARCHAR(100) NOT NULL,
    [phone_number] VARCHAR(20),
    [address] TEXT NOT NULL,
    [city] VARCHAR(100),
    [postal_code] VARCHAR(10),
    [latitude] DECIMAL(10,7),
    [longitude] DECIMAL(10,7),
    [is_deleted] TINYINT NOT NULL CONSTRAINT [shipment_addresses_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [shipment_addresses_created_at_df] DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [shipment_addresses_updated_at_df] DEFAULT GETDATE(),
    [district_id] VARCHAR(50),
    CONSTRAINT [shipment_addresses_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[shipment_logs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [shipment_id] INT NOT NULL,
    [awb_number] VARCHAR(50),
    [transaction_id] INT NOT NULL,
    [reff_id] INT NOT NULL,
    [status] VARCHAR(50) NOT NULL,
    [location] VARCHAR(100),
    [remarks] VARCHAR(255),
    [image] TEXT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [shipment_logs_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [shipment_logs_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [shipment_logs_awb_number_key] UNIQUE NONCLUSTERED ([awb_number])
);

-- CreateTable
CREATE TABLE [dbo].[district] (
    [id] INT NOT NULL IDENTITY(1,1),
    [postal_code] VARCHAR(10) NOT NULL,
    [district_id] VARCHAR(20) NOT NULL,
    [district_name] VARCHAR(100) NOT NULL,
    [regency_name] VARCHAR(100) NOT NULL,
    [province_name] VARCHAR(100) NOT NULL,
    CONSTRAINT [district_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[idempotency_keys] (
    [id] INT NOT NULL IDENTITY(1,1),
    [key] VARCHAR(255) NOT NULL,
    [response] NVARCHAR(max),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [idempotency_keys_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [idempotency_keys_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [idempotency_keys_key_key] UNIQUE NONCLUSTERED ([key])
);

-- CreateTable
CREATE TABLE [dbo].[special_expedition] (
    [id] INT NOT NULL IDENTITY(1,1),
    [courier_code] VARCHAR(20) NOT NULL,
    [name] VARCHAR(100) NOT NULL,
    [minimal_fee] INT NOT NULL CONSTRAINT [special_expedition_minimal_fee_df] DEFAULT 0,
    [description] VARCHAR(255),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [special_expedition_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [special_expedition_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [special_expedition_courier_code_key] UNIQUE NONCLUSTERED ([courier_code])
);

-- AddForeignKey
ALTER TABLE [dbo].[pickup_points] ADD CONSTRAINT [pickup_points_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [shipments_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [shipments_pickup_point_id_fkey] FOREIGN KEY ([pickup_point_id]) REFERENCES [dbo].[pickup_points]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipments] ADD CONSTRAINT [shipments_shipment_address_id_fkey] FOREIGN KEY ([shipment_address_id]) REFERENCES [dbo].[shipment_addresses]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipment_addresses] ADD CONSTRAINT [shipment_addresses_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shipment_logs] ADD CONSTRAINT [shipment_logs_shipment_id_fkey] FOREIGN KEY ([shipment_id]) REFERENCES [dbo].[shipments]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
